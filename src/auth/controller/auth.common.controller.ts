import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserService, ENUM_USER_STATUS_CODE_ERROR } from '@/user';
import { DebuggerService } from '@/debugger';
import { LoggerService, ENUM_LOGGER_ACTION } from '@/logger';
import { HelperDateService } from '@/utils/helper';
import { SuccessException } from '@/utils/error';
import { Response, IResponse } from '@/utils/response';
import { AuthLoginSerialization } from '../serialization/auth.login.serialization';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '@acp/role';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthService } from '../service/auth.service';
import {
  ENUM_AUTH_STATUS_CODE_ERROR,
  ENUM_AUTH_STATUS_CODE_SUCCESS,
} from '../auth.constant';
import { ENUM_ORGANIZATION_STATUS_CODE_ERROR } from '@/organization';
import { AuthRefreshJwtGuard, Token, User } from '../auth.decorator';

@Controller({
  version: '1',
  path: '/auth',
})
export class AuthCommonController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Response('auth.login', ENUM_AUTH_STATUS_CODE_SUCCESS.AUTH_LOGIN_SUCCESS)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: AuthLoginDto): Promise<IResponse> {
    const rememberMe: boolean = body.rememberMe ? true : false;

    const user = await this.userService.findOne({
      where: { email: body.email },
      relations: [
        'organization',
        'role',
        'role.policy',
        'role.policy.subjects',
        'role.policy.subjects.abilities',
      ],
    });

    if (!user) {
      this.debuggerService.error(
        'Authorized error user not found',
        'AuthController',
        'login',
      );

      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }

    if (!user.organization) {
      this.debuggerService.error(
        'Authorized error organization not found',
        'AuthController',
        'login',
      );

      throw new NotFoundException({
        statusCode:
          ENUM_ORGANIZATION_STATUS_CODE_ERROR.ORGANIZATION_NOT_FOUND_ERROR,
        message: 'organization.error.notFound',
      });
    } else if (!user.organization.isActive) {
      this.debuggerService.error(
        'Authorized error organization is not active',
        'AuthController',
        'login',
      );

      throw new NotFoundException({
        statusCode:
          ENUM_ORGANIZATION_STATUS_CODE_ERROR.ORGANIZATION_IS_INACTIVE_ERROR,
        message: 'organization.error.inactive',
      });
    }

    const validate: boolean = await this.authService.validateUser(
      body.password,
      user.password,
    );

    if (!validate) {
      this.debuggerService.error(
        'Authenticate error',
        'AuthController',
        'login',
      );

      throw new BadRequestException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_NOT_MATCH_ERROR,
        message: 'auth.error.passwordNotMatch',
      });
    } else if (!user.isActive) {
      this.debuggerService.error(
        'Auth Block Not Active',
        'AuthController',
        'login',
      );

      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
        message: 'user.error.inactive',
      });
    } else if (!user.role.isActive) {
      this.debuggerService.error(
        'Role Block Not Active',
        'AuthController',
        'login',
      );

      throw new ForbiddenException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_INACTIVE_ERROR,
        message: 'role.error.inactive',
      });
    }

    const safeData: AuthLoginSerialization =
      await this.authService.serializationLogin(user);

    // TODO: cache in redis safeData with user role and permission for next api calls

    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(safeData, rememberMe);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(safeData, rememberMe, {
        loginDate: payloadAccessToken.loginDate,
      });

    const accessToken: string = await this.authService.createAccessToken(
      payloadAccessToken,
    );

    const refreshToken: string = await this.authService.createRefreshToken(
      payloadRefreshToken,
      rememberMe,
    );

    const today: Date = this.helperDateService.create();
    const passwordExpired: Date = this.helperDateService.create(
      user.passwordExpired,
    );

    if (today > passwordExpired) {
      this.debuggerService.error('Password expired', 'AuthController', 'login');

      throw new SuccessException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_EXPIRED_ERROR,
        message: 'auth.error.passwordExpired',
        data: {
          accessToken,
          refreshToken,
        },
      });
    }

    await this.loggerService.info({
      action: ENUM_LOGGER_ACTION.LOGIN,
      description: `${user.id} do login`,
      user: user.id,
      tags: ['login', 'withEmail'],
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Response('auth.refresh', ENUM_AUTH_STATUS_CODE_SUCCESS.AUTH_REFRESH_SUCCESS)
  @AuthRefreshJwtGuard()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @User()
    { id, rememberMe, loginDate }: Record<string, any>,
    @Token() refreshToken: string,
  ): Promise<IResponse> {
    const user = await this.userService.findOneById(id, {
      relations: ['role', 'organization'],
    });

    if (!user) {
      this.debuggerService.error(
        'Authorized error user not found',
        'AuthController',
        'refresh',
      );

      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    } else if (!user.isActive) {
      this.debuggerService.error(
        'Auth Block Not Active',
        'AuthController',
        'refresh',
      );

      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
        message: 'user.error.inactive',
      });
    } else if (!user.role.isActive) {
      this.debuggerService.error('Role Block', 'AuthController', 'refresh');

      throw new ForbiddenException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_INACTIVE_ERROR,
        message: 'role.error.inactive',
      });
    }

    if (!user.organization) {
      this.debuggerService.error(
        'Authorized error organization not found',
        'AuthController',
        'refresh',
      );

      throw new NotFoundException({
        statusCode:
          ENUM_ORGANIZATION_STATUS_CODE_ERROR.ORGANIZATION_NOT_FOUND_ERROR,
        message: 'organization.error.notFound',
      });
    } else if (!user.organization.isActive) {
      this.debuggerService.error(
        'Organization Block Not Active',
        'AuthController',
        'refresh',
      );

      throw new NotFoundException({
        statusCode:
          ENUM_ORGANIZATION_STATUS_CODE_ERROR.ORGANIZATION_IS_INACTIVE_ERROR,
        message: 'organization.error.inactive',
      });
    }

    const today: Date = this.helperDateService.create();
    const passwordExpired: Date = this.helperDateService.create(
      user.passwordExpired,
    );

    if (today > passwordExpired) {
      this.debuggerService.error(
        'Password expired',
        'AuthController',
        'refresh',
      );

      throw new ForbiddenException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_EXPIRED_ERROR,
        message: 'auth.error.passwordExpired',
      });
    }

    const safe: AuthLoginSerialization =
      await this.authService.serializationLogin(user);
    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(safe, rememberMe, {
        loginDate,
      });

    const accessToken: string = await this.authService.createAccessToken(
      payloadAccessToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}

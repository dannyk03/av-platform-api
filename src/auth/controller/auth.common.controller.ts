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
  async login(@Body() body: AuthLoginDto): Promise<IResponse | any> {
    const rememberMe: boolean = body.rememberMe ? true : false;

    const user = await this.userService.findOne({
      where: { email: body.email },
      relations: [
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
}

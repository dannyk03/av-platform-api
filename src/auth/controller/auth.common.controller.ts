import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
// Services
import { UserService } from '@/user/service/user.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { LoggerService } from '@/logger/service/logger.service';
import { HelperDateService } from '@/utils/helper';
import { AuthService } from '../service/auth.service';
//
import { EnumUserStatusCodeError } from '@/user';
import { EnumLoggerAction } from '@/logger';
import { EnumStatusCodeError, SuccessException } from '@/utils/error';
import { Response, IResponse } from '@/utils/response';
import { AuthLoginSerialization } from '../serialization/auth.login.serialization';
import { EnumRoleStatusCodeError } from '@acl/role';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { EnumAuthStatusCodeError } from '../auth.constant';
import { EnumOrganizationStatusCodeError } from '@/organization';
import {
  AuthJwtGuard,
  AuthRefreshJwtGuard,
  Token,
  ReqUser,
} from '../auth.decorator';
import { AuthChangePasswordDto } from '../dto';

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

  @Response('auth.login')
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
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
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
        statusCode: EnumOrganizationStatusCodeError.OrganizationNotFoundError,
        message: 'organization.error.notFound',
      });
    } else if (!user.organization.isActive) {
      this.debuggerService.error(
        'Authorized error organization is not active',
        'AuthController',
        'login',
      );

      throw new NotFoundException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationIsInactiveError,
        message: 'organization.error.inactive',
      });
    }

    const validate: boolean = await this.authService.validateUserPassword(
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
        statusCode: EnumAuthStatusCodeError.AuthPasswordNotMatchError,
        message: 'auth.error.notMatch',
      });
    } else if (!user.isActive) {
      this.debuggerService.error(
        'Auth Block Not Active',
        'AuthController',
        'login',
      );

      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserIsInactiveError,
        message: 'user.error.inactive',
      });
    } else if (!user.role.isActive) {
      this.debuggerService.error(
        'Role Block Not Active',
        'AuthController',
        'login',
      );

      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleIsInactiveError,
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
        statusCode: EnumAuthStatusCodeError.AuthPasswordExpiredError,
        message: 'auth.error.passwordExpired',
        data: {
          accessToken,
          refreshToken,
        },
      });
    }

    await this.loggerService.info({
      action: EnumLoggerAction.Login,
      description: `${user.id} do login`,
      user: user.id,
      tags: ['login', 'withEmail'],
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Response('auth.refresh')
  @AuthRefreshJwtGuard()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @ReqUser()
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
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    } else if (!user.isActive) {
      this.debuggerService.error(
        'Auth Block Not Active',
        'AuthController',
        'refresh',
      );

      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserIsInactiveError,
        message: 'user.error.inactive',
      });
    } else if (!user.role.isActive) {
      this.debuggerService.error('Role Block', 'AuthController', 'refresh');

      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleIsInactiveError,
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
        statusCode: EnumOrganizationStatusCodeError.OrganizationNotFoundError,
        message: 'organization.error.notFound',
      });
    } else if (!user.organization.isActive) {
      this.debuggerService.error(
        'Organization Block Not Active',
        'AuthController',
        'refresh',
      );

      throw new NotFoundException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationIsInactiveError,
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
        statusCode: EnumAuthStatusCodeError.AuthPasswordExpiredError,
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

  @Response('auth.changePassword')
  @AuthJwtGuard()
  @Patch('/change-password')
  async changePassword(
    @Body() body: AuthChangePasswordDto,
    @ReqUser('id') id: string,
  ): Promise<void> {
    const user = await this.userService.findOneById(id);

    if (!user) {
      this.debuggerService.error(
        'User not found',
        'AuthController',
        'changePassword',
      );

      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    }

    const matchPassword: boolean = await this.authService.validateUserPassword(
      body.oldPassword,
      user.password,
    );
    if (!matchPassword) {
      this.debuggerService.error(
        "Old password doesn't match",
        'AuthController',
        'changePassword',
      );

      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthPasswordNotMatchError,
        message: 'auth.error.passwordNotMatch',
      });
    }

    const newMatchPassword: boolean =
      await this.authService.validateUserPassword(
        body.newPassword,
        user.password,
      );
    if (newMatchPassword) {
      this.debuggerService.error(
        "New password cant't be the same as old password",
        'AuthController',
        'changePassword',
      );

      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthPasswordNewMustDifferenceError,
        message: 'auth.error.newPasswordMustDifference',
      });
    }

    try {
      const password = await this.authService.createPassword(body.newPassword);

      await this.userService.updatePassword(user.id, password);
    } catch (err) {
      this.debuggerService.error(
        'Change password error internal server error',
        'AuthController',
        'changePassword',
        err,
      );

      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
      });
    }

    return;
  }
}

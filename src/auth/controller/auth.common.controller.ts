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
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Response as ExpressResponse } from 'express';
import { v4 as uuidV4 } from 'uuid';
// Services
import { UserService } from '@/user/service/user.service';
import { DebuggerService } from '@/debugger/service';
import { LogService } from '@/log/service';
import { HelperDateService, HelperJwtService } from '@/utils/helper/service';
import { EmailService } from '@/messaging/service/email/email.service';
import { AuthService } from '../service/auth.service';
import { AuthSignUpVerificationService } from '../service/auth-signup-verification.service';
//
import { EnumUserStatusCodeError, ReqUser } from '@/user';
import { EnumLoggerAction, IReqLogData } from '@/log';
import { EnumStatusCodeError, SuccessException } from '@/utils/error';
import { Response, IResponse } from '@/utils/response';
import { AuthUserLoginSerialization } from '../serialization/auth-user.login.serialization';
import { EnumRoleStatusCodeError } from '@acl/role';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { EnumAuthStatusCodeError } from '../auth.constant';
import { EnumOrganizationStatusCodeError } from '@/organization';
import {
  AuthChangePasswordGuard,
  AuthRefreshJwtGuard,
  Token,
  ReqJwtUser,
} from '../auth.decorator';
import { AuthChangePasswordDto, AuthSignUpDto } from '../dto';
import { ReqLogData, UserAgent } from '@/utils/request';
import { User } from '@/user/entity/user.entity';
import { ConnectionNames } from '@/database';
import { IResult } from 'ua-parser-js';

@Controller({
  version: '1',
  path: '/auth',
})
export class AuthCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly logService: LogService,
    private readonly configService: ConfigService,
    private readonly helperJwtService: HelperJwtService,
    private readonly emailService: EmailService,
    private readonly authSignUpVerificationService: AuthSignUpVerificationService,
  ) {}

  @Response('auth.login')
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Res({ passthrough: true })
    response: ExpressResponse,
    @Body()
    body: AuthLoginDto,
    @ReqLogData()
    logData: IReqLogData,
  ): Promise<IResponse> {
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');
    const rememberMe: boolean = body.rememberMe ? true : false;

    const user = await this.userService.findOne({
      where: { email: body.email },
      relations: [
        'organization',
        'authConfig',
        'role',
        'role.policy',
        'role.policy.subjects',
        'role.policy.subjects.abilities',
      ],
      select: {
        organization: {
          isActive: true,
          name: true,
        },
        authConfig: {
          password: true,
          passwordExpiredAt: true,
        },
      },
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

      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationInactiveError,
        message: 'organization.error.inactive',
      });
    }

    const validate: boolean = await this.authService.validateUserPassword(
      body.password,
      user.authConfig.password,
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
        statusCode: EnumUserStatusCodeError.UserInactiveError,
        message: 'user.error.inactive',
      });
    } else if (!user.role.isActive) {
      this.debuggerService.error(
        'Role Block Not Active',
        'AuthController',
        'login',
      );

      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleInactiveError,
        message: 'role.error.inactive',
      });
    }

    const safeData: AuthUserLoginSerialization =
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

    const now = this.helperDateService.create();
    const passwordExpiredAt = this.helperDateService.create(
      user.authConfig.passwordExpiredAt,
    );

    if (now > passwordExpiredAt) {
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

    await this.logService.info({
      ...logData,
      action: EnumLoggerAction.Login,
      description: `${user.id} do login`,
      user: user,
      tags: ['login', 'withEmail'],
    });

    response.cookie('accessToken', accessToken, {
      secure: isSecureMode,
      expires: this.helperJwtService.getJwtExpiresDate(accessToken),
      sameSite: 'strict',
      httpOnly: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Response('auth.signUp')
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signup(
    @Body()
    { email, password, firstName, lastName, mobileNumber }: AuthSignUpDto,
    @UserAgent() userAgent: IResult,
    @ReqLogData()
    logData: IReqLogData,
  ): Promise<IResponse> {
    const expiresInDays = this.configService.get<number>(
      'user.signUpCodeExpiresInDays',
    );
    const checkExist = await this.userService.checkExist(email, mobileNumber);

    if (checkExist.email && checkExist.mobileNumber) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserExistsError,
        message: 'user.error.exist',
      });
    } else if (checkExist.email) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserEmailExistError,
        message: 'user.error.emailExist',
      });
    } else if (checkExist.mobileNumber) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserMobileNumberExistError,
        message: 'user.error.mobileNumberExist',
      });
    }

    try {
      const { salt, passwordHash, passwordExpiredAt } =
        await this.authService.createPassword(password);

      return await this.defaultDataSource.transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          const signUpUser = await this.userService.create({
            isActive: false,
            email,
            mobileNumber,
            firstName,
            lastName,
            authConfig: {
              password: passwordHash,
              salt,
              passwordExpiredAt,
            },
          });

          await transactionalEntityManager.save(signUpUser);

          const signUpCode = uuidV4().replaceAll('-', '');

          const signUpEmailVerificationLink =
            await this.authSignUpVerificationService.create({
              email,
              user: signUpUser,
              expiresAt: this.helperDateService.forwardInDays(expiresInDays),
              signUpCode,
              userAgent,
            });

          await this.logService.info({
            ...logData,
            action: EnumLoggerAction.Login,
            description: `${signUpUser.email} do signup`,
            user: signUpUser,
            tags: ['signup', 'withEmail'],
            transactionalEntityManager,
          });

          await transactionalEntityManager.save(signUpEmailVerificationLink);

          this.emailService.sendSignUpEmailVerification({
            email,
            signUpCode,
            expiresInDays,
          });

          return {
            signUpCode,
          };
        },
      );
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @Response('auth.refresh')
  @HttpCode(HttpStatus.OK)
  @AuthRefreshJwtGuard()
  @Post('/refresh')
  async refresh(
    @Res({ passthrough: true })
    response: ExpressResponse,
    @ReqUser()
    reqUser: User,
    @ReqJwtUser()
    { rememberMe, loginDate }: Record<string, any>,
    @Token() refreshToken: string,
  ): Promise<IResponse> {
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');
    const now = this.helperDateService.create();
    const userPasswordExpiredAt = this.helperDateService.create(
      reqUser.authConfig.passwordExpiredAt,
    );

    if (now > userPasswordExpiredAt) {
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

    const safeData: AuthUserLoginSerialization =
      await this.authService.serializationLogin(reqUser);

    // TODO: cache in redis safeData with user role and permission for next api calls

    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(safeData, rememberMe, {
        loginDate,
      });

    const accessToken: string = await this.authService.createAccessToken(
      payloadAccessToken,
    );

    response.cookie('accessToken', accessToken, {
      secure: isSecureMode,
      expires: this.helperJwtService.getJwtExpiresDate(accessToken),
      sameSite: 'strict',
      httpOnly: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Response('auth.changePassword')
  @AuthChangePasswordGuard()
  @Patch('/change-password')
  async changePassword(
    @Body() body: AuthChangePasswordDto,
    @ReqJwtUser('id') id: string,
  ): Promise<void> {
    const user = await this.userService.findOneById(id, {
      relations: ['authConfig'],
      select: {
        authConfig: {
          password: true,
        },
      },
    });

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
      user.authConfig.password,
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
        user.authConfig.password,
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

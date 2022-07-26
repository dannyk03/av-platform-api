import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { Response as ExpressResponse } from 'express';
import { DataSource } from 'typeorm';
import { IResult } from 'ua-parser-js';

import { User } from '@/user/entity';

import { AuthService, AuthSignUpVerificationLinkService } from '../service';
import { LogService } from '@/log/service';
import { UserService } from '@/user/service';
import { HelperDateService, HelperJwtService } from '@/utils/helper/service';

import { AuthUserLoginSerialization } from '../serialization/auth-user.login.serialization';

import {
  AuthChangePasswordGuard,
  AuthRefreshJwtGuard,
  LoginGuard,
  ReqJwtUser,
  Token,
} from '../auth.decorator';

import { AuthChangePasswordDto, AuthSignUpDto } from '../dto';
import { AuthLoginDto } from '../dto/auth.login.dto';

import { ConnectionNames } from '@/database';
import { EnumLogAction, IReqLogData } from '@/log';
import { EmailService } from '@/messaging/email';
import { EnumUserStatusCodeError, ReqUser } from '@/user';
import { EnumStatusCodeError, SuccessException } from '@/utils/error';
import { ReqLogData, RequestUserAgent } from '@/utils/request';
import { IResponse, Response } from '@/utils/response';

import { EnumAuthStatusCodeError } from '../auth.constant';

@Controller({
  version: '1',
  path: '/auth',
})
export class AuthCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly helperDateService: HelperDateService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly logService: LogService,
    private readonly configService: ConfigService,
    private readonly helperJwtService: HelperJwtService,
    private readonly emailService: EmailService,
    private readonly authSignUpVerificationLinkService: AuthSignUpVerificationLinkService,
  ) {}

  @Response('auth.login')
  @HttpCode(HttpStatus.OK)
  @LoginGuard()
  @Post('/login')
  async login(
    @Res({ passthrough: true })
    response: ExpressResponse,
    @Body()
    body: AuthLoginDto,
    @ReqUser()
    user: User,
    @ReqLogData()
    logData: IReqLogData,
  ): Promise<IResponse> {
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');

    const rememberMe: boolean = body.rememberMe ? true : false;

    const validate: boolean = await this.authService.validateUser(
      body.password,
      user.authConfig.password,
    );

    if (!validate) {
      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthPasswordNotMatchError,
        message: 'auth.error.notMatch',
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
    const passwordExpiredAt = this.helperDateService.create({
      date: user.authConfig.passwordExpiredAt,
    });

    if (now > passwordExpiredAt) {
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
      action: EnumLogAction.Login,
      description: `${user.id} do login`,
      user: user,
      tags: ['login', 'withEmail'],
    });

    response.cookie('accessToken', accessToken, {
      secure: isSecureMode,
      expires: this.helperJwtService.getJwtExpiresDate(accessToken),
      sameSite: 'lax',
      httpOnly: true,
    });

    return {
      refreshToken,
    };
  }

  @Response('auth.signUp')
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signUp(
    @Res({ passthrough: true })
    response: ExpressResponse,
    @Body()
    { email, password, firstName, lastName, phoneNumber }: AuthSignUpDto,
    @RequestUserAgent() userAgent: IResult,
    @ReqLogData()
    logData: IReqLogData,
  ) {
    const expiresInDays = this.configService.get<number>(
      'user.signUpCodeExpiresInDays',
    );
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');
    const checkExist = await this.userService.checkExist(email, phoneNumber);

    if (checkExist.email && checkExist.phoneNumber) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserExistsError,
        message: 'user.error.exists',
      });
    }

    if (checkExist.email) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserEmailExistsError,
        message: 'user.error.emailExists',
      });
    }

    if (checkExist.phoneNumber) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserPhoneNumberExistsError,
        message: 'user.error.phoneNumberExists',
      });
    }

    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const { salt, passwordHash, passwordExpiredAt } =
          await this.authService.createPassword(password);

        const signUpUser = await this.userService.create({
          isActive: true,
          email,
          phoneNumber,
          profile: { firstName, lastName },
          authConfig: {
            password: passwordHash,
            salt,
            passwordExpiredAt,
          },
        });

        await transactionalEntityManager.save(signUpUser);

        const signUpEmailVerificationLink =
          await this.authSignUpVerificationLinkService.create({
            email,
            user: signUpUser,
            userAgent,
            expiresAt: this.helperDateService.forwardInDays(expiresInDays),
          });

        const safeData: AuthUserLoginSerialization =
          await this.authService.serializationLogin(signUpUser);

        // TODO: cache in redis safeData with user role and permission for next api calls

        const rememberMe = false;
        const payloadAccessToken: Record<string, any> =
          await this.authService.createPayloadAccessToken(safeData, rememberMe);

        const accessToken: string = await this.authService.createAccessToken(
          payloadAccessToken,
        );

        await this.emailService.sendSignUpEmailVerification({
          email,
          code: signUpEmailVerificationLink.code,
          expiresInDays,
        });

        await transactionalEntityManager.save(signUpEmailVerificationLink);

        response.cookie('accessToken', accessToken, {
          secure: isSecureMode,
          expires: this.helperJwtService.getJwtExpiresDate(accessToken),
          sameSite: 'lax',
          httpOnly: true,
        });

        // For local development/testing
        const isProduction =
          this.configService.get<boolean>('app.isProduction');
        if (!(isProduction || isSecureMode)) {
          return { code: signUpEmailVerificationLink.code };
        }
      },
    );
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
    const userPasswordExpiredAt = this.helperDateService.create({
      date: reqUser.authConfig.passwordExpiredAt,
    });

    if (now > userPasswordExpiredAt) {
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
      sameSite: 'lax',
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
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    }

    const matchPassword: boolean = await this.authService.validateUser(
      body.oldPassword,
      user.authConfig.password,
    );
    if (!matchPassword) {
      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthPasswordNotMatchError,
        message: 'auth.error.passwordNotMatch',
      });
    }

    const newMatchPassword: boolean = await this.authService.validateUser(
      body.newPassword,
      user.authConfig.password,
    );
    if (newMatchPassword) {
      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthPasswordNewMustDifferenceError,
        message: 'auth.error.newPasswordMustDifference',
      });
    }

    try {
      const password = await this.authService.createPassword(body.newPassword);

      await this.userService.updatePassword(user.id, password);
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
        cause: err.message,
      });
    }

    return;
  }
}

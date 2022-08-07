import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { EnumAuthStatusCodeError, EnumUserStatusCodeError } from '@avo/type';

import { Response as ExpressResponse } from 'express';
import { DataSource } from 'typeorm';
import { IResult } from 'ua-parser-js';

import { User } from '@/user/entity';

import { AuthService, AuthSignUpVerificationLinkService } from '../service';
import { UserService } from '@/user/service';
import { HelperCookieService, HelperDateService } from '@/utils/helper/service';

import { AuthUserLoginSerialization } from '../serialization/auth-user.login.serialization';

import {
  AuthChangePasswordGuard,
  AuthLogoutGuard,
  AuthRefreshJwtGuard,
  LoginGuard,
  ReqJwtUser,
  Token,
} from '../auth.decorator';

import { AuthChangePasswordDto, AuthSignUpDto } from '../dto';
import { AuthLoginDto } from '../dto/auth.login.dto';

import { ConnectionNames } from '@/database';
import { EnumLogAction, LogTrace } from '@/log';
import { EmailService } from '@/messaging/email';
import { ReqUser } from '@/user';
import { RequestUserAgent } from '@/utils/request';
import { IResponse, Response } from '@/utils/response';

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
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly helperCookieService: HelperCookieService,
    private readonly authSignUpVerificationLinkService: AuthSignUpVerificationLinkService,
  ) {}

  @Response('auth.login')
  @HttpCode(HttpStatus.OK)
  // @LogTrace(EnumLogAction.Login, { tags: ['login', 'withEmail'] })
  @LoginGuard()
  @Post('/login')
  async login(
    @Res({ passthrough: true })
    response: ExpressResponse,
    @Body()
    body: AuthLoginDto,
    @ReqUser()
    user: User,
  ): Promise<IResponse> {
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

    const checkPasswordExpired: boolean =
      await this.authService.checkPasswordExpired(
        user.authConfig.passwordExpiredAt,
      );

    if (checkPasswordExpired) {
      return {
        metadata: {
          statusCode: EnumAuthStatusCodeError.AuthPasswordExpiredError,
          message: 'auth.error.passwordExpired',
        },
        accessToken,
        refreshToken,
      };
    }

    await this.helperCookieService.attachAccessToken(response, accessToken);

    return {
      refreshToken,
    };
  }

  @Response('auth.signUp')
  @HttpCode(HttpStatus.OK)
  // @LogTrace(EnumLogAction.SignUp, { tags: ['signup', 'withEmail'] })
  @Post('/signup')
  async signUp(
    @Res({ passthrough: true })
    response: ExpressResponse,
    @Body()
    { email, password, firstName, lastName, phoneNumber, title }: AuthSignUpDto,
    @RequestUserAgent() userAgent: IResult,
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

    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const { salt, passwordHash, passwordExpiredAt } =
          await this.authService.createPassword(password);

        const signUpUser = await this.userService.create({
          isActive: true,
          email,
          phoneNumber,
          profile: { firstName, lastName, title },
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

        await this.emailService.sendSignUpEmailVerification({
          email,
          code: signUpEmailVerificationLink.code,
          expiresInDays,
        });

        await transactionalEntityManager.save(signUpEmailVerificationLink);

        await this.helperCookieService.detachAccessToken(response);

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

    await this.helperCookieService.attachAccessToken(response, accessToken);

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

    const password = await this.authService.createPassword(body.newPassword);

    await this.userService.updatePassword(user.id, password);
  }

  @Response('auth.logout')
  @HttpCode(HttpStatus.OK)
  @AuthLogoutGuard()
  @Post('/logout')
  async logout(
    @Res({ passthrough: true })
    response: ExpressResponse,
  ) {
    await this.helperCookieService.detachAccessToken(response);
    // TODO invalidate/blacklist refresh token
  }
}

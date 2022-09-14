import {
  BadRequestException,
  Body,
  Controller,
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

import {
  EnumAuthStatusCodeError,
  EnumMessagingStatusCodeError,
  EnumUserStatusCodeError,
  IResponseData,
} from '@avo/type';

import { Response } from 'express';
import { DataSource, IsNull } from 'typeorm';
import { IResult } from 'ua-parser-js';

import { SocialConnectionRequest } from '@/networking/entity';
import { User } from '@/user/entity';

import { AuthService, AuthSignUpVerificationLinkService } from '../service';
import { LogService } from '@/log/service';
import { EmailService } from '@/messaging/email/service';
import { UserService } from '@/user/service';
import { HelperCookieService, HelperDateService } from '@/utils/helper/service';

import { ReqJwtUser, Token } from '../decorator';
import { LogTrace } from '@/log/decorator';
import { ReqUser } from '@/user/decorator';
import { RequestUserAgent } from '@/utils/request/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import {
  AuthChangePasswordGuard,
  AuthLogoutGuard,
  AuthRefreshJwtGuard,
  LoginGuard,
} from '../guard';

import { AuthChangePasswordDto, AuthSignUpDto } from '../dto';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthResendSignupEmailDto } from '../dto/auth.resend-signup-email.dto';

import { AuthUserLoginSerialization } from '../serialization/auth-user.login.serialization';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';

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
    private readonly logService: LogService,
    private readonly authSignUpVerificationLinkService: AuthSignUpVerificationLinkService,
  ) {}

  @ClientResponse('auth.login')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.Login, {
    tags: ['login', 'withEmail'],
    mask: {
      passwordStrategyFields: ['password'],
      // emailStrategyFields: ['email'],
    },
  })
  @LoginGuard()
  @Post('/login')
  async login(
    @Res({ passthrough: true })
    response: Response,
    @Body()
    body: AuthLoginDto,
    @ReqUser()
    user: User,
  ): Promise<IResponseData> {
    const rememberMe = Boolean(body.rememberMe);

    const isValid =
      body.password &&
      user.authConfig?.password &&
      (await this.authService.validateUser(
        body.password,
        user.authConfig?.password,
      ));

    if (!isValid) {
      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthPasswordNotMatchError,
        message: 'auth.error.badRequest',
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

  @ClientResponse('auth.signUpResendEmail')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.SignUp, {
    tags: ['signup', 'auth', 'resend', 'email'],
  })
  @Post('/signup-resend')
  async signUpResendEmail(@Body() { email }: AuthResendSignupEmailDto) {
    const findAuthSignUpVerificationLink =
      await this.authSignUpVerificationLinkService.findOne({
        where: { user: { email } },
      });

    if (!findAuthSignUpVerificationLink) {
      return;
    }

    const emailSent = await this.emailService.resendSignUpEmailVerification({
      email: findAuthSignUpVerificationLink.email,
      code: findAuthSignUpVerificationLink.code,
      expiresAt: findAuthSignUpVerificationLink.expiresAt,
      firstName: findAuthSignUpVerificationLink.user?.profile?.firstName,
    });

    if (!emailSent) {
      throw new InternalServerErrorException({
        statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
        message: 'messaging.error.email.send',
      });
    }

    // For local development/testing
    const isProduction = this.configService.get<boolean>('app.isProduction');
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');
    if (!(isProduction || isSecureMode)) {
      return { code: findAuthSignUpVerificationLink.code };
    }
  }

  @ClientResponse('auth.signUp')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.SignUp, {
    tags: ['signup', 'auth', 'withEmail'],
    mask: {
      // emailStrategyFields: ['personal.email'],
      passwordStrategyFields: ['password'],
      phoneNumberStrategyFields: ['personal.phoneNumber'],
      jsonStrategyFields: ['personal.firstName', 'personal.lastName'],
    },
  })
  @Post('/signup')
  async signUp(
    @Res({ passthrough: true })
    response: Response,
    @Body()
    {
      password,
      personal: {
        email,
        firstName,
        lastName,
        phoneNumber,
        birthMonth,
        birthDay,
        workAnniversaryMonth,
        workAnniversaryDay,
        kidFriendlyActivities,
        home,
        shipping,
      },
      personas,
      dietary,
    }: AuthSignUpDto,
    @RequestUserAgent() userAgent: IResult,
  ): Promise<IResponseData> {
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
        message: 'auth.error.badRequest',
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
          profile: {
            firstName,
            lastName,
            home,
            shipping,
            personas,
            dietary,
            birthMonth,
            birthDay,
            workAnniversaryMonth,
            workAnniversaryDay,
            kidFriendlyActivities,
          },
          authConfig: {
            password: passwordHash,
            salt,
            passwordExpiredAt,
          },
        });

        const saveUser = await transactionalEntityManager.save(signUpUser);
        this.logService.info({
          transactionalEntityManager,
          action: EnumLogAction.SignUp,
          tags: ['signup', 'auth', 'withEmail'],
          description: 'Create new user',
          data: {
            id: saveUser.id,
          },
        });

        // Update connection requests with new signed-up User
        transactionalEntityManager.update(
          SocialConnectionRequest,
          { tempAddresseeEmail: email, addresseeUser: IsNull() },
          { addresseeUser: saveUser },
        );

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
          firstName: signUpUser.profile.firstName,
        });

        await transactionalEntityManager.save(signUpEmailVerificationLink);
        this.logService.info({
          action: EnumLogAction.SignUp,
          tags: ['signup', 'auth', 'withEmail', 'magic-link'],
          description: 'Create new signup email verification link',
          data: {
            id: signUpEmailVerificationLink.id,
          },
        });

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

  @ClientResponse('auth.refresh')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.Refresh, {
    tags: ['refresh', 'auth', 'jwt'],
  })
  @AuthRefreshJwtGuard()
  @Post('/refresh')
  async refresh(
    @Res({ passthrough: true })
    response: Response,
    @ReqUser()
    reqUser: User,
    @ReqJwtUser()
    { rememberMe, loginDate }: Record<string, any>,
    @Token() refreshToken: string,
  ): Promise<IResponseData> {
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

  @ClientResponse('auth.changePassword')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.SignUp, {
    tags: ['changePassword', 'auth'],
    mask: {
      passwordStrategyFields: ['oldPassword', 'newPassword'],
    },
  })
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

  @ClientResponse('auth.logout')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.SignUp, {
    tags: ['logout', 'auth'],
  })
  @AuthLogoutGuard()
  @Post('/logout')
  async logout(
    @Res({ passthrough: true })
    response: Response,
  ) {
    await this.helperCookieService.detachAccessToken(response);
    // TODO invalidate/blacklist refresh token
  }
}

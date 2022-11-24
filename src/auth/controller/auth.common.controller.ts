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
  Query,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  EnumAuthStatusCodeError,
  EnumMessagingStatusCodeError,
  EnumNetworkingConnectionRequestStatus,
  EnumNetworkingConnectionType,
  EnumUserStatusCodeError,
  IResponseData,
} from '@avo/type';

import { Response } from 'express';
import { DataSource, IsNull } from 'typeorm';
import { IResult } from 'ua-parser-js';

import { UserAuthConfig } from '../entity';
import { SocialConnectionRequest } from '@/networking/entity';
import { User } from '@/user/entity';

import {
  AuthService,
  AuthSignUpVerificationLinkService,
  ResetPasswordLinkService,
} from '../service';
import { LogService } from '@/log/service';
import { EmailService } from '@/messaging/email/service';
import {
  InvitationLinkService,
  SocialConnectionRequestService,
  SocialConnectionService,
  SocialNetworkingService,
} from '@/networking/service';
import { UserService } from '@/user/service';
import { HelperCookieService, HelperDateService } from '@/utils/helper/service';

import { ReqJwtUser, Token } from '../decorator';
import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import { RequestUserAgent } from '@/utils/request/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import {
  AuthChangePasswordGuard,
  AuthLogoutGuard,
  AuthRefreshJwtGuard,
  LoginGuard,
} from '../guard';

import {
  AuthChangePasswordDto,
  AuthResetPasswordRequestDto,
  AuthResetPasswordSetDto,
  AuthSignUpDto,
  AuthSignUpRefDto,
  AuthSmsOtpGetDto,
  AuthSmsOtpVerifyDto,
} from '../dto';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthResendSignupEmailDto } from '../dto/auth.resend-signup-email.dto';
import { MagicLinkDto } from '@/magic-link/dto';

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
    private readonly defaultDataSource: DataSource,
    private readonly helperDateService: HelperDateService,
    private readonly userService: UserService,
    private readonly invitationLinkService: InvitationLinkService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly helperCookieService: HelperCookieService,
    private readonly socialNetworkingService: SocialNetworkingService,
    private readonly logService: LogService,
    private readonly authSignUpVerificationLinkService: AuthSignUpVerificationLinkService,
    private readonly socialConnectionService: SocialConnectionService,
    private readonly socialConnectionRequestService: SocialConnectionRequestService,
    private readonly resetPasswordLinkService: ResetPasswordLinkService,
  ) {}

  @ClientResponse('auth.smsOtpGet')
  @Throttle(1, 5)
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.OtpSmsRequest, {
    tags: ['otp', 'sms'],
  })
  @Post('/otp/sms')
  async createSmsVerificationOTP(
    @Body() { phoneNumber }: AuthSmsOtpGetDto,
  ): Promise<void> {
    const findUser = await this.userService.findUserByPhoneNumberForOtp({
      phoneNumber,
    });

    if (!findUser?.phoneNumber) {
      throw new NotFoundException({
        silent: true,
        statusCode: EnumUserStatusCodeError.UserPhoneNumberNotFoundError,
        message: 'user.error.phoneNumberNotFound',
      });
    }

    if (findUser?.authConfig?.phoneVerifiedAt) {
      throw new BadRequestException({
        silent: true,
        statusCode: EnumAuthStatusCodeError.AuthPhoneNumberAlreadyVerifiedError,
        message: 'auth.error.phoneVerified',
      });
    }

    try {
      const isProduction = this.configService.get<boolean>('app.isProduction');
      if (isProduction) {
        await this.authService.createVerificationsSmsOPT({
          phoneNumber,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: EnumAuthStatusCodeError.AuthOtpCreateError,
        message: 'auth.error.otp',
        error,
      });
    }
  }

  @ClientResponse('auth.smsOtpVerify')
  @Throttle(1, 5)
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.OtpSmsVerify, {
    tags: ['otp', 'sms'],
  })
  @Post('/otp/sms/verify')
  async verifySmsVerificationOTP(
    @Body() { phoneNumber, code }: AuthSmsOtpVerifyDto,
  ): Promise<IResponseData> {
    const findUser = await this.userService.findOne({
      where: {
        phoneNumber,
      },
      relations: {
        authConfig: true,
        organization: true,
        role: true,
      },
      select: {
        authConfig: {
          id: true,
          phoneVerifiedAt: true,
          emailVerifiedAt: true,
          passwordExpiredAt: true,
        },
        organization: {
          isActive: true,
          id: true,
          name: true,
          slug: true,
        },
      },
    });

    if (!findUser?.phoneNumber) {
      throw new NotFoundException({
        silent: true,
        statusCode: EnumUserStatusCodeError.UserPhoneNumberNotFoundError,
        message: 'user.error.phoneNumberNotFound',
      });
    }

    if (findUser?.authConfig?.phoneVerifiedAt) {
      throw new BadRequestException({
        silent: true,
        statusCode: EnumAuthStatusCodeError.AuthPhoneNumberAlreadyVerifiedError,
        message: 'auth.error.phoneVerified',
      });
    }

    try {
      const isProduction = this.configService.get<boolean>('app.isProduction');

      const isOtpApproved = isProduction
        ? await this.authService.checkVerificationSmsOTP({
            phoneNumber,
            code,
          })
        : code === this.configService.get<string>('twilio.dev.nonProdMagicOTP');

      if (!isOtpApproved) {
        throw new BadRequestException({
          statusCode: EnumAuthStatusCodeError.AuthWrongOtpValidationError,
          message: 'auth.error.optValidation',
        });
      }
    } catch (error) {
      if (error.name === BadRequestException.name) {
        throw error;
      }
      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthWrongOtpValidationError,
        message: 'auth.error.optValidation',
        error,
      });
    }

    await this.authService.setUserPhoneNumberVerified({ phoneNumber });

    const safeData: AuthUserLoginSerialization =
      await this.authService.serializationLogin(findUser);

    // TODO: cache in redis safeData with user role and permission for next api calls

    const rememberMe = false;
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

    return {
      accessToken,
      refreshToken,
    };
  }

  @ClientResponse('auth.login')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.Login, {
    tags: ['login', 'withEmail'],
    mask: {
      passwordStrategyFields: ['password'],
    },
  })
  @LoginGuard()
  @Post('/login')
  async login(
    @Res({ passthrough: true })
    response: Response,
    @Body()
    body: AuthLoginDto,
    @ReqAuthUser()
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
        statusCode: EnumAuthStatusCodeError.AuthWrongCredentialsError,
        message: 'auth.error.credentials',
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

    // await this.helperCookieService.attachAccessToken(response, accessToken);

    return {
      accessToken,
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

    const expiresInDays = this.configService.get<number>(
      'user.signUpCodeExpiresInDays',
    );

    const emailSent = await this.emailService.sendSignUpEmailVerification({
      email: findAuthSignUpVerificationLink.email,
      code: findAuthSignUpVerificationLink.code,
      firstName: findAuthSignUpVerificationLink.user?.profile?.firstName,
      expiresInDays,
    });

    findAuthSignUpVerificationLink.expiresAt =
      this.helperDateService.forwardInDays(expiresInDays);

    await this.authSignUpVerificationLinkService.save(
      findAuthSignUpVerificationLink,
    );

    if (!emailSent) {
      throw new InternalServerErrorException({
        statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
        message: 'messaging.error.email.send',
      });
    }

    // For local development/testing
    const isDevelopment = this.configService.get<boolean>('app.isDevelopment');
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');
    if (isDevelopment || !isSecureMode) {
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
        phoneNumber,
        firstName,
        lastName,
        birthMonth,
        birthDay,
        workAnniversaryMonth,
        workAnniversaryDay,
        kidFriendlyActivities,
        home,
        shipping,
        funFacts,
        desiredSkills,
      },
      personas,
      dietary,
    }: AuthSignUpDto,
    @Query() { ref, type }: AuthSignUpRefDto,
    @RequestUserAgent() userAgent: IResult,
  ): Promise<IResponseData> {
    const expiresInDays = this.configService.get<number>(
      'user.signUpCodeExpiresInDays',
    );

    const checkExist = await this.userService.checkExist({
      email,
      phoneNumber,
    });

    if (checkExist.email && checkExist.phoneNumber) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserExistsError,
        message: 'user.error.exists',
      });
    }

    if (checkExist.email) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserEmailExistsError,
        message: 'auth.error.emailTaken',
      });
    }

    if (checkExist.phoneNumber) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserPhoneNumberExistsError,
        message: 'user.error.phoneNumberExists',
      });
    }

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const { passwordHash, passwordExpiredAt } =
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
            funFacts,
            desiredSkills,
          },
          authConfig: {
            password: passwordHash,
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
        await transactionalEntityManager.update(
          SocialConnectionRequest,
          { tempAddresseeEmail: email, addresseeUser: IsNull() },
          { addresseeUser: saveUser },
        );

        const signUpUserInvitationLink =
          await this.invitationLinkService.create({
            user: signUpUser,
          });
        await transactionalEntityManager.save(signUpUserInvitationLink);

        const signUpEmailVerificationLink =
          await this.authSignUpVerificationLinkService.create({
            email,
            user: signUpUser,
            userAgent,
            expiresAt: this.helperDateService.forwardInDays(expiresInDays),
          });

        const emailSent = await this.emailService.sendSignUpEmailVerification({
          email,
          code: signUpEmailVerificationLink.code,
          expiresInDays,
          firstName: signUpUser.profile.firstName,
        });

        if (!emailSent) {
          throw new InternalServerErrorException({
            statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
            message: 'messaging.error.email.send',
          });
        }

        // Find the connection request that led to the registered user
        if (ref) {
          if (type == EnumNetworkingConnectionType.ConnectionRequest) {
            const socialConnectionRequest =
              await this.socialConnectionRequestService.findOne({
                where: {
                  status: EnumNetworkingConnectionRequestStatus.Pending,
                  id: ref,
                  tempAddresseeEmail: saveUser.email,
                },
                relations: ['addresserUser'],
              });

            if (socialConnectionRequest) {
              // Auto approve connection request
              const createSocialConnection1 =
                await this.socialConnectionService.create({
                  user1: socialConnectionRequest.addresserUser,
                  user2: saveUser,
                });
              const createSocialConnection2 =
                await this.socialConnectionService.create({
                  user1: saveUser,
                  user2: socialConnectionRequest.addresserUser,
                });

              await transactionalEntityManager.save([
                createSocialConnection1,
                createSocialConnection2,
              ]);

              socialConnectionRequest.status =
                EnumNetworkingConnectionRequestStatus.Approved;
              const saveSocialConnectionRequest =
                await transactionalEntityManager.save(socialConnectionRequest);

              if (saveSocialConnectionRequest) {
                const inviterUserWithProfile = await this.userService.findOne({
                  where: { id: socialConnectionRequest.addresserUser.id },
                  relations: ['profile'],
                });

                await this.emailService.sendSurveyCompletedToInviter({
                  inviterUser: inviterUserWithProfile,
                  inviteeUser: saveUser,
                  socialConnectionRequestId: saveSocialConnectionRequest.id,
                });
              }
            }
          } else if (type == EnumNetworkingConnectionType.ShareableLink) {
            const invitationLink = await this.invitationLinkService.findOne({
              where: { id: ref },
              relations: ['user'],
              select: {
                id: true,
                user: {
                  id: true,
                },
              },
            });

            if (invitationLink?.user) {
              const socialConnection =
                await this.socialNetworkingService.createSocialConnection(
                  saveUser.id,
                  invitationLink.user.id,
                  false,
                );

              await transactionalEntityManager.save(socialConnection);
            }
          }
        }

        await transactionalEntityManager.save(signUpEmailVerificationLink);
        this.logService.info({
          action: EnumLogAction.SignUp,
          tags: ['signup', 'auth', 'withEmail', 'magic-link'],
          description: 'Create new signup email verification link',
          data: {
            id: signUpEmailVerificationLink.id,
          },
        });

        // For local development/testing
        const isDevelopment =
          this.configService.get<boolean>('app.isDevelopment');
        const isSecureMode: boolean =
          this.configService.get<boolean>('app.isSecureMode');

        if (isDevelopment || !isSecureMode) {
          return { code: signUpEmailVerificationLink.code };
        }
      },
    );

    try {
      // Skip sending sms on non production environments
      // instead use nonProdMagicOTP
      const isProduction = this.configService.get<boolean>('app.isProduction');
      if (phoneNumber && isProduction) {
        await this.authService.createVerificationsSmsOPT({ phoneNumber });
      }
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: EnumAuthStatusCodeError.AuthOtpCreateError,
        message: 'auth.error.otp',
        error,
      });
    }

    return result;
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
    @ReqAuthUser()
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

  @ClientResponse('auth.resetPasswordRequest')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.ResetPassword, {
    tags: ['resetPassword', 'auth'],
  })
  @Post('/reset')
  async resetPasswordRequest(
    @Body() { email }: AuthResetPasswordRequestDto,
  ): Promise<IResponseData> {
    const findUser = await this.userService.findOne({
      where: {
        email,
      },
      relations: ['profile'],
      select: {
        id: true,
        email: true,
        profile: {
          firstName: true,
        },
      },
    });

    if (!findUser) {
      this.logService.error({
        action: EnumLogAction.ResetPassword,
        description: 'Reset password attempt',
        tags: ['resetPassword'],
        data: { error: 'User does not exist' },
      });
      return;
    }

    const createResetPasswordLink = await this.resetPasswordLinkService.create({
      email,
      expiresAt: this.helperDateService.forwardInMinutes(60),
      user: findUser,
    });

    const saveResetPasswordLink = await this.resetPasswordLinkService.save(
      createResetPasswordLink,
    );

    const emailSent = await this.emailService.sendResetPassword({
      email: saveResetPasswordLink.email,
      firstName: saveResetPasswordLink.user?.profile?.firstName,
      code: saveResetPasswordLink.code,
    });

    if (!emailSent) {
      throw new InternalServerErrorException({
        statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
        message: 'messaging.error.email.send',
      });
    }

    // For local development/testing
    const isDevelopment = this.configService.get<boolean>('app.isDevelopment');
    const isSecureMode = this.configService.get<boolean>('app.isSecureMode');
    if (isDevelopment || !isSecureMode) {
      return { code: saveResetPasswordLink.code };
    }
  }

  @ClientResponse('auth.resetPasswordSet')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.ResetPassword, {
    tags: ['resetPassword', 'set', 'auth'],
    mask: {
      passwordStrategyFields: ['password'],
    },
  })
  @Patch('/reset')
  async resetPasswordSet(
    @Query()
    { code }: MagicLinkDto,
    @Body() { password }: AuthResetPasswordSetDto,
  ): Promise<void> {
    const existingResetPasswordLink =
      await this.resetPasswordLinkService.findOne({
        where: { code },
      });

    if (!existingResetPasswordLink) {
      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthBadRequestError,
        message: 'auth.error.badRequest',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt =
      existingResetPasswordLink.expiresAt &&
      this.helperDateService.create({
        date: existingResetPasswordLink.expiresAt,
      });

    if ((expiresAt && now > expiresAt) || existingResetPasswordLink.usedAt) {
      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthResetPasswordLinkExpired,
        message: 'auth.error.badRequest',
      });
    }

    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const { passwordHash, passwordExpiredAt } =
          await this.authService.createPassword(password);

        const findUser = await this.userService.findOneBy({
          email: existingResetPasswordLink.email,
        });

        await transactionalEntityManager.update(
          UserAuthConfig,
          { user: findUser },
          { password: passwordHash, passwordExpiredAt },
        );
        existingResetPasswordLink.usedAt = this.helperDateService.create();

        transactionalEntityManager.save(existingResetPasswordLink);
      },
    );
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

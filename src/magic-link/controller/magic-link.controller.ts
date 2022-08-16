import {
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  EnumGiftIntentStatusCodeError,
  EnumGiftStatusCodeError,
  EnumMessagingStatusCodeError,
  EnumOrganizationStatusCodeError,
  EnumUserStatusCodeError,
  IResponseData,
} from '@avo/type';

import { Response as ExpressResponse } from 'express';
import uniqBy from 'lodash/uniqBy';
import { DataSource, IsNull } from 'typeorm';

import { AuthService, AuthSignUpVerificationLinkService } from '@/auth/service';
import {
  GiftIntentConfirmationLinkService,
  GiftIntentReadyLinkService,
  GiftIntentService,
} from '@/gifting/service';
import { OrganizationInviteService } from '@/organization/service';
import { HelperCookieService, HelperDateService } from '@/utils/helper/service';

import { MagicLinkDto } from '../dto';

import { AuthUserLoginSerialization } from '@/auth';
import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';
import { Response } from '@/utils/response';

@Controller({})
export class MagicLinkController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly authSignUpVerificationService: AuthSignUpVerificationLinkService,
    private readonly helperDateService: HelperDateService,
    private readonly helperCookieService: HelperCookieService,
    private readonly organizationInviteService: OrganizationInviteService,
    private readonly giftIntentConfirmationLinkService: GiftIntentConfirmationLinkService,
    private readonly giftIntentReadyLinkService: GiftIntentReadyLinkService,
    private readonly giftIntentService: GiftIntentService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  @Response('user.signUpSuccess')
  @Get('/signup')
  async signUpValidate(
    @Query()
    { code }: MagicLinkDto,
    @Res({ passthrough: true })
    response: ExpressResponse,
  ): Promise<IResponseData> {
    const existingSignUpLink = await this.authSignUpVerificationService.findOne(
      {
        where: { code },
        relations: ['user', 'user.authConfig'],
        select: {
          user: {
            id: true,
            email: true,
            isActive: true,
            authConfig: {
              id: true,
              emailVerifiedAt: true,
            },
          },
        },
      },
    );

    if (!existingSignUpLink) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserSignUpLinkNotFound,
        message: 'user.error.code',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt =
      existingSignUpLink.expiresAt &&
      this.helperDateService.create({
        date: existingSignUpLink.expiresAt,
      });

    if ((expiresAt && now > expiresAt) || existingSignUpLink.usedAt) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserSignUpLinkExpired,
        message: 'user.error.signUpLink',
      });
    }

    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        existingSignUpLink.usedAt = this.helperDateService.create();
        existingSignUpLink.user.isActive = true;
        existingSignUpLink.user.authConfig.emailVerifiedAt =
          existingSignUpLink.usedAt;

        return transactionalEntityManager.save(existingSignUpLink);
      },
    );

    const safeData: AuthUserLoginSerialization =
      await this.authService.serializationLogin(existingSignUpLink.user);

    // TODO: cache in redis safeData with user role and permission for next api calls

    const rememberMe = true;
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
      false,
    );

    await this.helperCookieService.attachAccessToken(response, accessToken);

    return {
      refreshToken,
    };
  }

  @Response('organization.inviteValid')
  @Get('/org/join')
  async orgJoinValidate(
    @Query()
    { code }: MagicLinkDto,
  ): Promise<void> {
    const existingInvite = await this.organizationInviteService.findOneBy({
      code,
    });

    if (!existingInvite) {
      throw new NotFoundException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationInviteNotFoundError,
        message: 'organization.error.inviteInvalid',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt = this.helperDateService.create({
      date: existingInvite.expiresAt,
    });

    if (now > expiresAt || existingInvite.usedAt) {
      throw new ForbiddenException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationInviteExpiredError,
        message: 'organization.error.inviteInvalid',
      });
    }
  }

  @Response('gift.confirm')
  @Get('/confirm')
  async confirmSendGift(
    @Query()
    { code }: MagicLinkDto,
  ): Promise<void> {
    const existingGiftSendConfirmationLink =
      await this.giftIntentConfirmationLinkService.findOne({
        where: { code },
        relations: [
          'giftIntents',
          'giftIntents.sender',
          'giftIntents.recipient',
          'giftIntents.recipient.user',
          'giftIntents.sender.user',
          'giftIntents.sender.user.authConfig',
        ],
      });

    if (!existingGiftSendConfirmationLink) {
      throw new NotFoundException({
        statusCode: EnumGiftStatusCodeError.GiftConfirmationLinkNotFoundError,
        message: 'gift.error.code',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt =
      existingGiftSendConfirmationLink.expiresAt &&
      this.helperDateService.create({
        date: existingGiftSendConfirmationLink.expiresAt,
      });

    if (
      (expiresAt && now > expiresAt) ||
      existingGiftSendConfirmationLink.usedAt
    ) {
      throw new ForbiddenException({
        statusCode: EnumGiftStatusCodeError.GiftConfirmationLinkExpiredError,
        message: 'gift.error.verificationLink',
      });
    }

    const uniqueSenders = uniqBy(
      existingGiftSendConfirmationLink.giftIntents.map((gift) => gift.sender),
      'id',
    );

    if (uniqueSenders.length > 1) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftStatusCodeError.GiftSendersLimitError,
        message: 'gift.error.senders',
      });
    }

    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        existingGiftSendConfirmationLink.usedAt =
          this.helperDateService.create();
        await transactionalEntityManager.save(existingGiftSendConfirmationLink);

        await Promise.all([
          uniqueSenders.map(async (sender) => {
            const senderAuthConfig = sender.user?.authConfig;
            if (senderAuthConfig && !senderAuthConfig.emailVerifiedAt) {
              senderAuthConfig.emailVerifiedAt =
                this.helperDateService.create();
              return transactionalEntityManager.save(senderAuthConfig);
            }
            return Promise.resolve();
          }),
        ]);

        await Promise.all(
          existingGiftSendConfirmationLink.giftIntents.map(
            async (giftIntent) => {
              const sent = this.emailService.sendGiftSurvey({
                senderEmail:
                  giftIntent.sender.user?.email ||
                  giftIntent.sender.additionalData['email'],
                recipientEmail:
                  giftIntent.recipient.user?.email ||
                  giftIntent.recipient.additionalData['email'],
              });

              if (sent) {
                giftIntent.sentAt = this.helperDateService.create();
                transactionalEntityManager.save(giftIntent);
              } else {
                throw new InternalServerErrorException({
                  statusCode:
                    EnumMessagingStatusCodeError.MessagingEmailSendError,
                  message: 'messaging.error.email.send',
                });
              }
            },
          ),
        );
      },
    );
  }

  @Response('gift.intent.ready')
  @Throttle(1, 5)
  @Get('/ready')
  async giftIntentReadyValidate(
    @Query()
    { code, lang }: MagicLinkDto,
  ): Promise<IResponseData> {
    const existingReadyLink = await this.giftIntentReadyLinkService.findOne({
      where: {
        code,
        usedAt: IsNull(),
        giftIntent: {
          submittedAt: IsNull(),
          giftOptions: {
            products: {
              displayOptions: {
                language: {
                  isoCode: lang,
                },
              },
            },
          },
        },
      },
      relations: [
        'giftIntent',
        'giftIntent.additionalData',
        'giftIntent.recipient',
        'giftIntent.recipient.user',
        'giftIntent.giftOptions',
        'giftIntent.giftOptions.products',
        'giftIntent.giftOptions.products.displayOptions',
        'giftIntent.giftOptions.products.displayOptions.images',
      ],
    });

    if (!existingReadyLink) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentUnprocessableError,
        message: 'gift.intent.error.unprocessable',
      });
    }

    return this.giftIntentService.serializationGiftIntentReady(
      existingReadyLink.giftIntent,
    );
  }
}

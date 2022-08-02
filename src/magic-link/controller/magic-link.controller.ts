import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  EnumGiftStatusCodeError,
  EnumOrganizationStatusCodeError,
  EnumUserStatusCodeError,
} from '@avo/type';

import { Response as ExpressResponse } from 'express';
import uniqBy from 'lodash/uniqBy';
import { DataSource } from 'typeorm';

import { AuthService, AuthSignUpVerificationLinkService } from '@/auth/service';
import { GiftSendConfirmationLinkService } from '@/gifting/gift/service';
import { OrganizationInviteService } from '@/organization/service';
import { HelperCookieService, HelperDateService } from '@/utils/helper/service';

import { MagicLinkDto } from '../dto';

import { AuthUserLoginSerialization } from '@/auth';
import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';
import { IResponse, Response } from '@/utils/response';

@Controller({})
export class MagicLinkController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly authSignUpVerificationService: AuthSignUpVerificationLinkService,
    private readonly helperDateService: HelperDateService,
    private readonly helperCookieService: HelperCookieService,
    private readonly organizationInviteService: OrganizationInviteService,
    private readonly giftSendConfirmationLinkService: GiftSendConfirmationLinkService,
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
  ): Promise<IResponse> {
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
  @Get('/join')
  async joinValidate(
    @Query()
    { code }: MagicLinkDto,
  ) {
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
    const existingGiftSendVerificationLink =
      await this.giftSendConfirmationLinkService.findOne({
        where: { code },
        relations: [
          'gifts',
          'gifts.sender',
          'gifts.recipient',
          'gifts.recipient.user',
          'gifts.sender.user',
          'gifts.sender.user.authConfig',
        ],
      });

    if (!existingGiftSendVerificationLink) {
      throw new NotFoundException({
        statusCode: EnumGiftStatusCodeError.GiftVerificationNotFoundError,
        message: 'gift.error.code',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt =
      existingGiftSendVerificationLink.expiresAt &&
      this.helperDateService.create({
        date: existingGiftSendVerificationLink.expiresAt,
      });

    if (
      (expiresAt && now > expiresAt) ||
      existingGiftSendVerificationLink.usedAt
    ) {
      throw new ForbiddenException({
        statusCode: EnumGiftStatusCodeError.GiftConfirmationLinkExpired,
        message: 'gift.error.verificationLink',
      });
    }

    const uniqueSenders = uniqBy(
      existingGiftSendVerificationLink.gifts.map((gift) => gift.sender),
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
        existingGiftSendVerificationLink.usedAt =
          this.helperDateService.create();
        await transactionalEntityManager.save(existingGiftSendVerificationLink);

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
          existingGiftSendVerificationLink.gifts.map(async (gift) =>
            this.emailService.sendGiftSurvey({
              senderEmail:
                gift.sender.user?.email || gift.sender.additionalData['email'],
              recipientEmail:
                gift.recipient.user?.email ||
                gift.recipient.additionalData['email'],
            }),
          ),
        );
      },
    );
  }
}

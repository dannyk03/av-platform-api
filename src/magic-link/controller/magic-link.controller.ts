import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import uniqBy from 'lodash/uniqBy';
// Services
import { HelperDateService } from '@/utils/helper/service';
import { AuthSignUpVerificationService } from '@/auth/service';
import { OrganizationInviteService } from '@/organization/service';
import { GiftSendConfirmationLinkService } from '@/gifting/gift/service';
import { UserService } from '@/user/service';
//
import { ConnectionNames } from '@/database';
import { Response, IResponse } from '@/utils/response';
import { EnumOrganizationStatusCodeError } from '@/organization';
import { MagicLinkDto } from '../dto';
import { EnumUserStatusCodeError } from '@/user';
import { EnumGiftStatusCodeError } from '@/gifting/gift';

@Controller({})
export class MagicLinkController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly authSignUpVerificationService: AuthSignUpVerificationService,
    private readonly helperDateService: HelperDateService,
    private readonly organizationInviteService: OrganizationInviteService,
    private readonly giftSendConfirmationLinkService: GiftSendConfirmationLinkService,
    private readonly userService: UserService,
  ) {}

  @Response('user.signUpSuccess')
  @Get('/signup')
  async signUpValidate(
    @Query()
    { code }: MagicLinkDto,
  ): Promise<IResponse> {
    const existingSignUpLink = await this.authSignUpVerificationService.findOne(
      {
        where: { code },
        relations: ['user', 'user.authConfig'],
        select: {
          user: {
            id: true,
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

    this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        existingSignUpLink.usedAt = this.helperDateService.create();
        existingSignUpLink.user.isActive = true;
        existingSignUpLink.user.authConfig.emailVerifiedAt =
          existingSignUpLink.usedAt;

        return transactionalEntityManager.save(existingSignUpLink);
      },
    );

    return;
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

    return;
  }

  @Response('gift.confirm')
  @Get('/confirm')
  async confirmSendGift(
    @Query()
    { code }: MagicLinkDto,
  ): Promise<IResponse> {
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

    this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        existingGiftSendVerificationLink.usedAt =
          this.helperDateService.create();
        transactionalEntityManager.save(existingGiftSendVerificationLink);

        return Promise.all([
          uniqueSenders.map(async (sender) => {
            const senderAuthConfig = sender.user.authConfig;
            if (!senderAuthConfig.emailVerifiedAt) {
              senderAuthConfig.emailVerifiedAt =
                this.helperDateService.create();
              return transactionalEntityManager.save(senderAuthConfig);
            }
            return Promise.resolve();
          }),
        ]);
      },
    );

    return;
  }
}

import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
// Services
import { DebuggerService } from '@/debugger/service';
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
    private readonly debuggerService: DebuggerService,
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
        relations: ['gifts', 'gifts.sender', 'gifts.recipient', 'gifts.sender'],
        select: {
          gifts: {
            sender: {
              id: true,
            },
          },
        },
      });

    if (!existingGiftSendVerificationLink) {
      throw new NotFoundException({
        statusCode: EnumGiftStatusCodeError.GiftVerificationNotFound,
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
        statusCode: EnumGiftStatusCodeError.GiftVerificationLinkExpired,
        message: 'gift.error.verificationLink',
      });
    }

    // const senderUser = this.userService.findOneBy({id:})

    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        existingGiftSendVerificationLink.usedAt =
          this.helperDateService.create();
        // existingGiftSendVerificationLink.user.isActive = true;
        // existingGiftSendVerificationLink.user.authConfig.emailVerifiedAt =
        //   existingSignUp.usedAt;

        return transactionalEntityManager.save(
          existingGiftSendVerificationLink,
        );
      },
    );
  }
}

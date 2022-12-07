import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  EnumGiftIntentStatusCodeError,
  EnumGiftingStatusCodeError,
  EnumMessagingStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import flatMap from 'lodash/flatMap';
import { DataSource, In, IsNull } from 'typeorm';

import { GiftIntent, GiftIntentConfirmationLink } from '../entity';
import { User } from '@/user/entity';

import {
  GiftIntentConfirmationLinkService,
  GiftIntentService,
  GiftSubmitService,
} from '../service';
import { ConnectionService } from '@/connection/service';
import { EmailService } from '@/messaging/email/service';
import { GiftOrderService } from '@/order/service';
import { UserService } from '@/user/service';
import { HelperDateService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { GiftIntentListDto, GiftOptionSubmitDto, GiftSendDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto';

import { GiftIntentGetSerialization } from '../serialization';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class GiftingCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
    private readonly emailService: EmailService,
    private readonly giftSubmitService: GiftSubmitService,
    private readonly giftIntentService: GiftIntentService,
    private readonly userService: UserService,
    private readonly giftConfirmationLinkService: GiftIntentConfirmationLinkService,
    private readonly paginationService: PaginationService,
    private readonly connectionService: ConnectionService,
    private readonly giftOrderService: GiftOrderService,
  ) {}

  @ClientResponse('gift.send')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.GiftSend, {
    tags: ['gifting', 'send'],
  })
  @AclGuard({
    loadSensitiveAuthData: true,
  })
  @Throttle(1, 5)
  @Post('/send')
  async sendGift(
    @Body()
    { recipients, additionalData }: GiftSendDto,
    @ReqAuthUser()
    reqUser: User,
  ): Promise<IResponseData> {
    const uniqueRecipients = [...new Set(recipients)];

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const giftIntents = await Promise.all(
          uniqueRecipients.map(async (recipient) => {
            if (recipient.userId === reqUser.id) {
              throw new BadRequestException({
                statusCode:
                  EnumGiftingStatusCodeError.GiftSendUnprocessableError,
                message: 'gift.error.send',
              });
            }

            const isConnected = await this.connectionService.checkConnection({
              user1Id: reqUser.id,
              user2Id: recipient.userId,
            });

            if (
              !(isConnected.networkConnection || isConnected.groupConnection)
            ) {
              throw new BadRequestException({
                statusCode:
                  EnumGiftingStatusCodeError.GiftSendNotSocialConnectionError,
                message: 'gift.error.send',
              });
            }

            const recipientUser = await this.userService.findOne({
              where: {
                id: recipient.userId,
              },
              select: {
                id: true,
              },
            });

            if (!recipientUser) {
              throw new BadRequestException({
                statusCode:
                  EnumGiftingStatusCodeError.GiftRecipientNotFoundError,
                message: 'gift.error.send',
              });
            }

            return this.giftIntentService.create({
              sender: {
                user: {
                  id: reqUser.id,
                },
              },
              recipient: {
                user: recipientUser,
              },
              additionalData: {
                occasion: additionalData.occasion,
                priceMin: additionalData.minPrice,
                priceMax: additionalData.maxPrice,
                currency: { code: additionalData.currency },
                targetDate: additionalData.targetDate,
              },
            });
          }),
        );

        // If sender email/phone not verified, need to confirm gift send

        const isSenderVerifiedUser =
          reqUser?.authConfig.emailVerifiedAt ||
          reqUser?.authConfig.phoneVerifiedAt;

        let confirmationLinkSave: GiftIntentConfirmationLink;

        if (!isSenderVerifiedUser) {
          const confirmationLink =
            await this.giftConfirmationLinkService.create({
              giftIntents,
            });

          confirmationLinkSave = await transactionalEntityManager.save(
            confirmationLink,
          );
        }

        const saveGiftIntents = await Promise.all(
          giftIntents.map(async (giftIntent) => {
            if (confirmationLinkSave) {
              const emailSent = await this.emailService.sendGiftConfirm({
                email: giftIntent.sender.user?.email,
                code: confirmationLinkSave.code,
              });
              if (!emailSent) {
                throw new InternalServerErrorException({
                  statusCode:
                    EnumMessagingStatusCodeError.MessagingEmailSendError,
                  message: 'messaging.error.email.send',
                });
              }
              giftIntent.confirmationLink = confirmationLinkSave;
            }

            if (isSenderVerifiedUser) {
              giftIntent.confirmedAt = this.helperDateService.create();
            }

            if (giftIntent?.recipient?.user) {
              giftIntent.acceptedAt = this.helperDateService.create();
            }

            return transactionalEntityManager.save(giftIntent);
          }),
        );

        return {
          ...(confirmationLinkSave && { code: confirmationLinkSave.code }),
          giftIntentIds: saveGiftIntents
            ? saveGiftIntents.map(({ id }) => id)
            : null,
        };
      },
    );

    // For local development/testing
    const isDevelopment = this.configService.get<boolean>('app.isDevelopment');
    const isSecureMode = this.configService.get<boolean>('app.isSecureMode');
    if (isDevelopment || !isSecureMode) {
      return result;
    }
  }

  @ClientResponsePaging('gift.intent.list', {
    classSerialization: GiftIntentGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/intent/list')
  async list(
    @Query()
    {
      page,
      perPage,
      sort,
      search,
      availableSort,
      availableSearch,
    }: GiftIntentListDto,
    @ReqAuthUser() reqUser: User,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const giftIntents = await this.giftIntentService.paginatedSearchBy({
      ownerId: reqUser.id,
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
      search,
    });

    const totalData = await this.giftIntentService.getTotal({
      ownerId: reqUser.id,
      search,
    });

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data: giftIntents,
    };
  }

  @ClientResponse('gift.intent.get', {
    classSerialization: GiftIntentGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/intent/:id')
  async get(
    @Param('id')
    giftIntentId: string,
    @ReqAuthUser() reqUser: User,
  ) {
    const getGiftIntent = await this.giftIntentService.findOne({
      where: {
        id: giftIntentId,
        sender: {
          user: {
            id: reqUser.id,
          },
        },
      },
      relations: [
        'additionalData',
        'recipient.user.profile.shipping',
        'sender.user',
        'giftOptions.products.displayOptions.images',
        'giftSubmit.gifts.products.displayOptions.images',
      ],
    });

    if (!getGiftIntent) {
      throw new BadRequestException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentNotFoundError,
        message: 'gift.intent.error.notFound',
      });
    }

    return getGiftIntent;
  }

  @ClientResponse('gift.intent.submit')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.GiftSubmit, {
    tags: ['gifting', 'submit'],
  })
  @Throttle(1, 5)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/intent/submit/:id')
  async giftIntentSubmit(
    @Body()
    { giftOptionIds, personalNote, submitReason }: GiftOptionSubmitDto,
    @ReqAuthUser()
    reqUser: User,
    @Param('id')
    giftIntentId: string,
  ): Promise<IResponseData> {
    const giftIntent = await this.giftIntentService.findOne({
      where: {
        id: giftIntentId,
        sender: {
          user: {
            id: reqUser.id,
          },
        },
        giftOptions: { id: In(giftOptionIds) },
        submittedAt: IsNull(),
      },
      relations: ['giftOptions', 'additionalData', 'sender', 'sender.user'],
    });

    if (!giftIntent) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentUnprocessableError,
        message: 'gift.intent.error.unprocessable',
      });
    }

    if (!giftIntent.readyAt) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumGiftIntentStatusCodeError.GiftIntentNotReadyForSubmitError,
        message: 'gift.intent.error.notReadyForSubmit',
      });
    }

    const giftIntentOptionsIds = flatMap(giftIntent.giftOptions, 'id');

    if (!giftOptionIds.every((id) => giftIntentOptionsIds.includes(id))) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumGiftIntentStatusCodeError.GiftIntentUnprocessableSubmitError,
        message: 'gift.intent.error.unprocessableSubmit',
      });
    }

    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const createGiftSubmit = await this.giftSubmitService.create({
          giftIntent,
          gifts: giftIntent.giftOptions.filter(({ id }) =>
            giftOptionIds.includes(id),
          ),
          personalNote,
          submitReason,
        });

        const createGiftOrder = await this.giftOrderService.create({
          user: reqUser,
          giftIntent,
        });

        const [saveGiftSubmit, saveGiftOrder] =
          await transactionalEntityManager.save([
            createGiftSubmit,
            createGiftOrder,
          ]);

        await transactionalEntityManager.update(
          GiftIntent,
          { id: giftIntentId },
          { submittedAt: this.helperDateService.create() },
        );

        return {
          giftOrderId: saveGiftOrder?.id,
          giftSubmitId: saveGiftSubmit?.id,
          giftIntentId,
        };
      },
    );
  }
}

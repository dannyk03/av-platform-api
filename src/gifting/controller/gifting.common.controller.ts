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
  EnumMessagingStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import flatMap from 'lodash/flatMap';
import { DataSource, In, IsNull, Not } from 'typeorm';

import { User } from '@/user/entity';

import {
  GiftIntentConfirmationLinkService,
  GiftIntentService,
  GiftSubmitService,
} from '../service';
import { UserService } from '@/user/service';
import { HelperDateService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { GiftIntentSerialization } from '../serialization';

import { GiftIntentListDto, GiftOptionSubmitDto } from '../dto';
import { GiftSendDto } from '../dto/gift.send.dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard } from '@/auth';
import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';
import { ReqUser } from '@/user';
import { RequestParamGuard } from '@/utils/request';
import { Response, ResponsePaging } from '@/utils/response';

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
  ) {}

  @Response('gift.send')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Throttle(1, 5)
  @Post('/send')
  async sendGiftSurvey(
    @Body()
    { sender, recipients, additionalData }: GiftSendDto,
    @ReqUser()
    reqUser: User,
  ): Promise<IResponseData> {
    const uniqueRecipients = [...new Set(recipients)];

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const giftIntents = await Promise.all(
          uniqueRecipients.map(async (recipient) => {
            const maybeRecipientUser = await this.userService.findOneBy({
              email: recipient.email,
            });

            return this.giftIntentService.create({
              sender: {
                user: {
                  id: reqUser.id,
                },
                additionalData: {
                  ...(await this.giftIntentService.serializationSenderGiftAdditionalData(
                    sender,
                  )),
                },
              },
              recipient: {
                user: maybeRecipientUser ? { id: maybeRecipientUser.id } : null,
                additionalData: {
                  ...(await this.giftIntentService.serializationRecipientGiftAdditionalData(
                    recipient,
                  )),
                },
              },
              additionalData: {
                occasion: additionalData.occasion,
                priceMin: additionalData.minPrice,
                priceMax: additionalData.maxPrice,
                currency: { code: additionalData.currency },
              },
            });
          }),
        );

        const confirmationLink = await this.giftConfirmationLinkService.create({
          giftIntents,
        });

        await transactionalEntityManager.save(confirmationLink);

        const saveGiftIntents = await Promise.all(
          giftIntents.map(async (giftIntent) => {
            const emailSent = await this.emailService.sendGiftConfirm({
              email: giftIntent.sender.user?.email,
              code: confirmationLink.code,
            });
            if (!emailSent) {
              throw new InternalServerErrorException({
                statusCode:
                  EnumMessagingStatusCodeError.MessagingEmailSendError,
                message: 'messaging.error.email.send',
              });
            }
            giftIntent.confirmationLink = confirmationLink;
            return transactionalEntityManager.save(giftIntent);
          }),
        );

        return {
          code: confirmationLink.code,
          giftIntentIds: saveGiftIntents
            ? saveGiftIntents.map(({ id }) => id)
            : null,
        };
      },
    );

    // For local development/testing
    const isProduction = this.configService.get<boolean>('app.isProduction');
    const isSecureMode = this.configService.get<boolean>('app.isSecureMode');
    if (!(isProduction || isSecureMode)) {
      return result;
    }
  }

  @ResponsePaging('gift.intent.list')
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
    @ReqUser() reqUser: User,
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

    const data: GiftIntentSerialization[] =
      await this.giftIntentService.serializationGiftIntentList(giftIntents);

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data,
    };
  }

  @Response('gift.intent.get')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/intent/:id')
  async get(@Param('id') giftIntentId: string, @ReqUser() reqUser: User) {
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
        'recipient',
        'sender',
        'recipient.user',
        'sender.user',
        'giftOptions',
        'giftOptions.products',
        'giftSubmit',
        'giftSubmit.gifts',
        'giftSubmit.gifts.products',
      ],
    });

    if (!getGiftIntent) {
      throw new BadRequestException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentNotFoundError,
        message: 'gift.intent.error.notFound',
      });
    }

    return this.giftIntentService.serializationGiftIntent(getGiftIntent);
  }

  @Response('gift.intent.submit')
  @HttpCode(HttpStatus.OK)
  @Throttle(1, 5)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/intent/submit/:id')
  async giftIntentSubmit(
    @Body() { giftOptionIds }: GiftOptionSubmitDto,
    @ReqUser()
    reqUser: User,
    @Param('id') giftIntentId: string,
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
        confirmedAt: Not(IsNull()),
        acceptedAt: Not(IsNull()),
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

    const giftIntentOptionsIds = flatMap(giftIntent.giftOptions, 'id');

    if (!giftOptionIds.every((id) => giftIntentOptionsIds.includes(id))) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumGiftIntentStatusCodeError.GiftIntentUnprocessableSubmitError,
        message: 'gift.intent.error.unprocessableSubmit',
      });
    }

    const result = this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const createGiftSubmit = await this.giftSubmitService.create({
          giftIntent,
          gifts: giftIntent.giftOptions.filter(({ id }) =>
            giftOptionIds.includes(id),
          ),
        });

        giftIntent.submittedAt = this.helperDateService.create();

        const saveGiftSubmit = await transactionalEntityManager.save(
          createGiftSubmit,
        );
        const saveGiftIntent = await transactionalEntityManager.save(
          giftIntent,
        );

        return {
          giftIntentId: saveGiftIntent?.id,
          giftSubmitId: saveGiftSubmit?.id,
        };
      },
    );

    // For local development/testing
    const isProduction = this.configService.get<boolean>('app.isProduction');
    const isSecureMode = this.configService.get<boolean>('app.isSecureMode');
    if (!(isProduction || isSecureMode)) {
      return result;
    }
  }
}

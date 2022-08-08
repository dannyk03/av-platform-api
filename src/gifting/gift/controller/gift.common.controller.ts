import {
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

import { Action, Subjects } from '@avo/casl';
import {
  EnumFileStatusCodeError,
  EnumGiftIntentStatusCodeError,
  EnumMessagingStatusCodeError,
  EnumProductStatusCodeError,
  IResponse,
  IResponseData,
  IResponsePaging,
  IResponsePagingData,
} from '@avo/type';

import { DataSource } from 'typeorm';

import { User } from '@/user/entity';

import {
  GiftIntentService,
  GiftSendConfirmationLinkService,
  GiftService,
} from '../service';
import { ProductService } from '@/catalog/product/service';
import { UserService } from '@/user/service';
import { HelperDateService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { GiftIntentSerialization } from '../serialization';
import { ProductListSerialization } from '@/catalog/product/serialization';

import { GiftIntentListDto, GiftOptionCreateDto } from '../dto';
import { GiftSendDto } from '../dto/gift.send.dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard, ReqJwtUser } from '@/auth';
import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';
import { ReqUser } from '@/user';
import { RequestParamGuard } from '@/utils/request';
import { Response, ResponsePaging } from '@/utils/response';

@Controller({
  version: '1',
})
export class GiftCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
    private readonly emailService: EmailService,
    private readonly giftService: GiftService,
    private readonly giftIntentService: GiftIntentService,
    private readonly userService: UserService,
    private readonly giftSendConfirmationLinkService: GiftSendConfirmationLinkService,
    private readonly paginationService: PaginationService,
    private readonly productService: ProductService,
  ) {}

  @Response('gift.send')
  @HttpCode(HttpStatus.OK)
  // @GifSendGuard()
  @AclGuard()
  @Throttle(1, 5)
  @Post('/send')
  async sendGiftSurvey(
    @Body()
    { sender, recipients, additionalData }: GiftSendDto,
    @ReqUser()
    reqUser: User,
  ): Promise<void> {
    const uniqueRecipients = [...new Set(recipients)];

    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const giftSends = await Promise.all(
          uniqueRecipients.map(async (recipient) => {
            const maybeRecipientUser = await this.userService.findOneBy({
              email: recipient.email,
            });

            return this.giftIntentService.create({
              sender: {
                user: reqUser,
                additionalData: {
                  ...(await this.giftIntentService.serializationSenderGiftAdditionalData(
                    sender,
                  )),
                },
              },
              recipient: {
                user: maybeRecipientUser,
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

        const confirmationLink =
          await this.giftSendConfirmationLinkService.create({
            gifts: giftSends,
          });

        await transactionalEntityManager.save(confirmationLink);

        await Promise.all(
          giftSends.map(async (giftSend) => {
            const emailSent = await this.emailService.sendGiftConfirm({
              email: giftSend.sender.user?.email,
              code: confirmationLink.code,
            });
            if (!emailSent) {
              throw new InternalServerErrorException({
                statusCode:
                  EnumMessagingStatusCodeError.MessagingEmailSendError,
                message: 'http.serverError.internalServerError',
              });
            }
            giftSend.confirmationLink = confirmationLink;
            return transactionalEntityManager.save(giftSend);
          }),
        );
      },
    );
  }

  @ResponsePaging('gift.intent.list')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Read,
        subject: Subjects.GiftIntent,
      },
    ],
    systemOnly: true,
  })
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
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const giftIntents = await this.giftIntentService.paginatedSearchBy({
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
      search,
    });

    const totalData = await this.giftIntentService.getTotal({
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

  @Response('gift.intent.addGiftOption')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Create,
        subject: Subjects.GiftOption,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Post('/intent/:id')
  async addGiftOption(
    @Param('id') giftIntentId: string,
    @Body() { productIds }: GiftOptionCreateDto,
  ): Promise<void> {
    const giftIntent = await this.giftIntentService.findOne({
      where: { id: giftIntentId },
      relations: ['giftOptions'],
    });

    if (!giftIntent) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentNotFoundError,
        message: 'gift.intent.error.notFound',
      });
    }
    const products = await this.productService.findAllByIds(productIds);

    if (!products || products.length !== productIds?.length) {
      throw new UnprocessableEntityException({
        statusCode: EnumProductStatusCodeError.ProductNotFoundError,
        message: 'product.error.notFound',
      });
    }

    const createGift = await this.giftService.create({
      products,
    });

    giftIntent.giftOptions = [...giftIntent.giftOptions, createGift];

    this.giftIntentService.save(giftIntent);
  }
}

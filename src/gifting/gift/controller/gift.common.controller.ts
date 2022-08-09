import {
  Body,
  Controller,
  Delete,
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
  EnumGiftIntentStatusCodeError,
  EnumMessagingStatusCodeError,
  EnumProductStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { DataSource, In, IsNull } from 'typeorm';

import { User } from '@/user/entity';

import {
  GiftIntentConfirmationLinkService,
  GiftIntentReadyLinkService,
  GiftIntentService,
  GiftService,
} from '../service';
import { ProductService } from '@/catalog/product/service';
import { UserService } from '@/user/service';
import { HelperDateService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { GiftIntentSerialization } from '../serialization';

import {
  GiftIntentListDto,
  GiftOptionCreateDto,
  GiftOptionDeleteDto,
} from '../dto';
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
    private readonly giftSendConfirmationLinkService: GiftIntentConfirmationLinkService,
    private readonly giftIntentReadyLinkService: GiftIntentReadyLinkService,
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

        const confirmationLink =
          await this.giftSendConfirmationLinkService.create({
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
  ): Promise<IResponseData> {
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

    return await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const createGift = await this.giftService.create({
          products,
        });

        const saveGift = await transactionalEntityManager.save(createGift);

        giftIntent.giftOptions = [...giftIntent.giftOptions, saveGift];

        await transactionalEntityManager.save(giftIntent);

        return saveGift;
      },
    );
  }

  @Response('gift.intent.deleteGiftOption')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Delete,
        subject: Subjects.GiftOption,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Delete('/intent/:id')
  async deleteGiftOption(
    @Param('id') giftIntentId: string,
    @Body() { giftOptionIds }: GiftOptionDeleteDto,
  ): Promise<IResponseData> {
    const { affected } = await this.giftService.deleteOneBy({
      id: In(giftOptionIds),
      giftIntent: { id: giftIntentId },
    });

    return {
      affected,
    };
  }

  @Response('gift.intent.ready')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.GiftIntent,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Post('/intent/ready/:id')
  async giftIntentReady(@Param('id') giftIntentId: string): Promise<any> {
    const giftIntent = await this.giftIntentService.findOne({
      where: { id: giftIntentId, readyAt: IsNull() },
      relations: [
        'giftOptions',
        'additionalData',
        'recipient',
        'sender',
        'recipient.user',
        'sender.user',
      ],
    });

    if (!giftIntent) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentUnprocessableError,
        message: 'gift.intent.error.unprocessable',
      });
    }

    if (!giftIntent?.giftOptions?.length) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentOptionsEmptyError,
        message: 'gift.intent.error.empty',
      });
    }

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const readyLink = await this.giftIntentReadyLinkService.create({
          giftIntent,
        });

        const saveReadyLink = await transactionalEntityManager.save(readyLink);

        const emailSent = await this.emailService.sendGiftReady({
          email:
            giftIntent.recipient?.user?.email ||
            giftIntent.recipient?.additionalData['email'],
          code: readyLink.code,
        });

        if (!emailSent) {
          throw new InternalServerErrorException({
            statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
            message: 'messaging.error.email.send',
          });
        }
        giftIntent.readyAt = this.helperDateService.create();

        const saveGiftIntent = await transactionalEntityManager.save(
          giftIntent,
        );

        return {
          code: saveReadyLink.code,
          giftIntentId: saveGiftIntent?.id,
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

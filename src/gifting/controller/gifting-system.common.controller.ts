import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Action, Subjects } from '@avo/casl';
import {
  EnumGiftIntentStatus,
  EnumGiftIntentStatusCodeError,
  EnumProductStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { DataSource, In } from 'typeorm';

import { GiftIntentService, GiftService } from '../service';
import { ProductService } from '@/catalog/product/service';
import { HelperDateService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { GiftIntentSerialization } from '../serialization';

import {
  GiftIntentListDto,
  GiftIntentStatusUpdateDto,
  GiftOptionCreateDto,
  GiftOptionDeleteDto,
} from '../dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard } from '@/auth';
import { ConnectionNames } from '@/database';
import { RequestParamGuard } from '@/utils/request';
import { Response, ResponsePaging } from '@/utils/response';

@Controller({
  version: '1',
})
export class GiftingSystemCommonController {
  private readonly logicalGiftIntentStatusOrder =
    Object.values(EnumGiftIntentStatus);

  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly helperDateService: HelperDateService,
    private readonly giftService: GiftService,
    private readonly giftIntentService: GiftIntentService,
    private readonly paginationService: PaginationService,
    private readonly productService: ProductService,
  ) {}

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

  @Response('gift.intent.status')
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
  @Patch('/intent/status/:id')
  async updateStatus(
    @Param('id') giftIntentId: string,
    @Body() { status }: GiftIntentStatusUpdateDto,
  ): Promise<IResponseData> {
    const giftIntent = await this.giftIntentService.findOne({
      where: {
        id: giftIntentId,
      },
      select: {
        id: true,
        createdAt: true,
        confirmedAt: true,
        acceptedAt: true,
        readyAt: true,
        submittedAt: true,
        shippedAt: true,
        deliveredAt: true,
      },
    });

    if (giftIntent[`${status.toLocaleLowerCase()}At`]) {
      throw new ForbiddenException({
        statusCode:
          EnumGiftIntentStatusCodeError.GiftIntentUnprocessableStatusUpdateError,
        message: 'gift.intent.error.statusAlready',
        data: { status },
      });
    }

    const prevLogicalStatus =
      this.logicalGiftIntentStatusOrder[
        this.logicalGiftIntentStatusOrder.indexOf(
          status as EnumGiftIntentStatus,
        ) - 1
      ];

    if (!giftIntent[`${prevLogicalStatus.toLocaleLowerCase()}At`]) {
      const currentStatus = this.logicalGiftIntentStatusOrder.find(
        (status, index, array) => {
          return (
            giftIntent[`${status.toLocaleLowerCase()}At`] &&
            !giftIntent[`${array[index + 1].toLocaleLowerCase()}At`]
          );
        },
      );

      throw new ForbiddenException({
        statusCode:
          EnumGiftIntentStatusCodeError.GiftIntentUnprocessableStatusUpdateError,
        message: 'gift.intent.error.statusNotAvailable',
        data: { status: currentStatus },
      });
    }

    if (status === EnumGiftIntentStatus.Ready) {
      return this.giftIntentService.notifyReady({ id: giftIntent.id });
    } else {
      giftIntent[`${status.toLocaleLowerCase()}At`] =
        this.helperDateService.create();
      return this.giftIntentService.save(giftIntent);
    }
  }

  @Response('gift.intent.get')
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
  @RequestParamGuard(IdParamDto)
  @Get('/intent/:id')
  async get(@Param('id') giftIntentId: string) {
    const getGiftIntent = await this.giftIntentService.findOne({
      where: { id: giftIntentId },
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

    return this.defaultDataSource.transaction(
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

  // @Response('gift.intent.ready')
  // @HttpCode(HttpStatus.OK)
  // @AclGuard({
  //   abilities: [
  //     {
  //       action: Action.Update,
  //       subject: Subjects.GiftIntent,
  //     },
  //   ],
  //   systemOnly: true,
  // })
  // @RequestParamGuard(IdParamDto)
  // @Post('/intent/ready/:id')
  // async giftIntentReady(
  //   @Param('id') giftIntentId: string,
  // ): Promise<IResponseData> {
  //   return this.giftIntentService.notifyReady({ id: giftIntentId });
  // }
}

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
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { Action, Subjects } from '@avo/casl';
import {
  EnumGiftIntentStatus,
  EnumGiftIntentStatusCodeError,
  EnumProductStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import flatMap from 'lodash/flatMap';
import { DataSource, In } from 'typeorm';

import { GiftIntentService, GiftService } from '../service';
import { ProductService } from '@/catalog/product/service';
import { HelperDateService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import {
  GiftIntentListDto,
  GiftIntentStatusUpdateDto,
  GiftOptionCreateDto,
  GiftOptionDeleteDto,
  GiftOptionUpdateDto,
  GiftOptionUpsetDto,
} from '../dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import {
  GiftGetSerialization,
  GiftIntentGetSerialization,
} from '../serialization';

import { ConnectionNames } from '@/database/constant';

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
    private readonly configService: ConfigService,
  ) {}

  @ClientResponsePaging('gift.intent.list', {
    classSerialization: GiftIntentGetSerialization,
  })
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
      lang,
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
      lang,
    });

    const totalData = await this.giftIntentService.getTotal({
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

  @ClientResponse('gift.intent.status')
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

    if (!giftIntent) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentNotFoundError,
        message: 'gift.intent.error.notFound',
      });
    }

    if (giftIntent[`${status.toLowerCase()}At`]) {
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

    if (!giftIntent[`${prevLogicalStatus.toLowerCase()}At`]) {
      const currentStatus = this.logicalGiftIntentStatusOrder.find(
        (status, index, array) => {
          return (
            giftIntent[`${status.toLowerCase()}At`] &&
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

    let devResult: any;

    if (status === EnumGiftIntentStatus.Ready) {
      devResult = await this.giftIntentService.notifyGiftOptionsReady({
        id: giftIntent.id,
        markAsReady: false,
      });
    }

    if (status === EnumGiftIntentStatus.Shipped) {
      devResult = await this.giftIntentService.notifyGiftShipped({
        id: giftIntent.id,
        markAsShipped: false,
      });
    }

    giftIntent[`${status.toLowerCase()}At`] = this.helperDateService.create();

    const isProduction = this.configService.get<boolean>('app.isProduction');
    const isSecureMode = this.configService.get<boolean>('app.isSecureMode');
    return {
      ...(await this.giftIntentService.save(giftIntent)),
      ...(!(isProduction || isSecureMode) && devResult),
    };
  }

  @ClientResponse('gift.intent.get', {
    classSerialization: GiftIntentGetSerialization,
  })
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
      where: {
        id: giftIntentId,
      },
      relations: [
        'additionalData',
        'recipient',
        'sender',
        'recipient.user',
        'recipient.user.profile',
        'sender.user',
        'sender.user.profile',
        'giftOptions',
        'giftOptions.products',
        'giftOptions.products.displayOptions',
        'giftOptions.products.displayOptions.language',
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

    return getGiftIntent;
  }

  @ClientResponse('gift.intent.addGiftOption', {
    classSerialization: GiftGetSerialization,
  })
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
    @Body() { productIds, lang }: GiftOptionCreateDto,
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
    const products = await this.productService.findAllByIds({
      productIds,
      lang,
    });

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

  @ClientResponse('gift.intent.updateGiftOption', {
    classSerialization: GiftGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.GiftOption,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Patch('/intent/update/:id')
  async updateGiftOption(
    @Param('id') giftIntentId: string,
    @Body()
    {
      addProductIds,
      deleteProductIds,
      giftOptionId,
      lang,
    }: GiftOptionUpdateDto,
  ): Promise<IResponseData> {
    const giftOption = await this.giftService.findOne({
      where: {
        id: giftOptionId,
        giftIntent: {
          id: giftIntentId,
        },
      },
      relations: ['giftIntent', 'products'],
      select: {
        products: true,
        giftIntent: {
          id: true,
        },
      },
    });

    if (!giftOption) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentOptionNotFoundError,
        message: 'gift.option.error.notFound',
      });
    }

    const existingProductIds = flatMap(giftOption.products, 'id');
    const missingProductIds = addProductIds.filter(
      (id) => !existingProductIds.includes(id),
    );

    const addProductsFind = addProductIds
      ? await this.productService.findAllByIds({
          productIds: missingProductIds,
          lang,
        })
      : [];

    if (
      missingProductIds &&
      missingProductIds?.length !== addProductsFind?.length
    ) {
      throw new UnprocessableEntityException({
        statusCode: EnumProductStatusCodeError.ProductNotFoundError,
        message: 'product.error.notFound',
      });
    }

    giftOption.products = [
      ...new Set([
        ...(deleteProductIds?.length
          ? giftOption.products?.filter(
              ({ id }) => !deleteProductIds.includes(id),
            )
          : giftOption.products),
        ...(deleteProductIds?.length
          ? addProductsFind?.filter(
              ({ id }) =>
                !deleteProductIds.includes(id) &&
                !Boolean(
                  giftOption.products.find((product) => product.id === id),
                ),
            )
          : addProductsFind),
      ]),
    ];

    return this.giftService.save(giftOption);
  }

  @ClientResponse('gift.intent.upsertGiftOption', {
    classSerialization: GiftGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.GiftOption,
      },
      {
        action: Action.Create,
        subject: Subjects.GiftOption,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Patch('/intent/:id')
  async upsertGiftOption(
    @Param('id') giftIntentId: string,
    @Body()
    { productIds, giftOptionId, lang }: GiftOptionUpsetDto,
  ): Promise<IResponseData> {
    const giftOption = giftOptionId
      ? await this.giftService.findOne({
          where: {
            id: giftOptionId,
            giftIntent: {
              id: giftIntentId,
            },
          },
          relations: ['giftIntent'],
          select: {
            products: true,
            giftIntent: {
              id: true,
            },
          },
        })
      : null;

    if (giftOption && !productIds?.length) {
      const { affected } = await this.giftService.deleteOneBy({
        id: giftOption.id,
      });
      return { deleted: affected };
    }

    if (giftOptionId && !giftOption) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentOptionNotFoundError,
        message: 'gift.option.error.notFound',
      });
    }

    const productsFind = productIds.length
      ? await this.productService.findAllByIds({
          productIds,
          lang,
        })
      : null;

    if (giftOption) {
      giftOption.products = productsFind;

      return this.giftService.save(giftOption);
    }

    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const findGiftIntent = await this.giftIntentService.findOne({
          where: {
            id: giftIntentId,
          },
          relations: ['giftOptions'],
          select: {
            id: true,
            giftOptions: true,
          },
        });

        if (!findGiftIntent) {
          throw new UnprocessableEntityException({
            statusCode: EnumGiftIntentStatusCodeError.GiftIntentNotFoundError,
            message: 'gift.intent.error.notFound',
          });
        }

        const createGift = await this.giftService.create({
          products: productsFind,
        });

        const saveGift = await transactionalEntityManager.save(createGift);

        findGiftIntent.giftOptions = [...findGiftIntent.giftOptions, saveGift];
        await transactionalEntityManager.save(findGiftIntent);

        return saveGift;
      },
    );
  }

  @ClientResponse('gift.intent.deleteGiftOption')
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
      deleted: affected,
    };
  }

  // @ClientResponse('gift.intent.ready')
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

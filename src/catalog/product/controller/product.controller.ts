import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';
import { EnumProductStatusCodeError } from '@avo/type';

import compact from 'lodash/compact';

import { ProductService } from '../service';
import { ProductImageService } from '@/catalog/product-image/service';
import { CloudinaryService } from '@/cloudinary/service';
import { PaginationService } from '@/utils/pagination/service';

import { ProductListSerialization } from '../serialization';

import { ProductCreateDto, ProductListDto, ProductUpdateDto } from '../dto';
import { ProductGetDto } from '../dto/product.get.dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard } from '@/auth';
import { EnumFileType, UploadFileMultiple } from '@/utils/file';
import { RequestParamGuard } from '@/utils/request';
import {
  IResponse,
  IResponsePaging,
  Response,
  ResponsePaging,
} from '@/utils/response';

@Controller({
  version: '1',
})
export class ProductCommonController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
    private readonly paginationService: PaginationService,
  ) {}

  @Response('product.create')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Create,
        subject: Subjects.Product,
      },
    ],
    systemOnly: true,
  })
  @UploadFileMultiple('images', EnumFileType.Image, true)
  @Post()
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body()
    {
      sku,
      name,
      description,
      brand,
      isActive,
      keywords,
      language,
    }: ProductCreateDto,
  ): Promise<IResponse> {
    const productExists = await this.productService.findOneBy({ sku });

    if (productExists) {
      throw new BadRequestException({
        statusCode: EnumProductStatusCodeError.ProductExistsError,
        message: 'product.error.exists',
      });
    }

    const saveImages = await this.productImageService.createImages({
      images,
      language,
    });

    const createProduct = await this.productService.create({
      brand,
      sku,
      isActive,
      displayOptions: [
        {
          language: { isoCode: language },
          keywords: [...new Set(keywords)],
          name,
          description,
          images: compact(saveImages),
        },
      ],
    });

    const createdProduct = await this.productService.save(createProduct);
    return this.productService.serialization(createdProduct);
  }

  @ResponsePaging('product.list')
  @AclGuard({
    abilities: [
      {
        action: Action.Read,
        subject: Subjects.Product,
      },
    ],
    systemOnly: true,
  })
  @Get('/list')
  async list(
    @Query()
    {
      lang,
      page,
      perPage,
      sort,
      search,
      keywords,
      availableSort,
      availableSearch,
      isActive,
    }: ProductListDto,
  ): Promise<IResponsePaging> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const products = await this.productService.paginatedSearchBy({
      language: lang,
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
      search,
      keywords,
      isActive,
    });

    const totalData = await this.productService.getTotal({
      language: lang,
      search,
      keywords,
      isActive,
    });

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data: ProductListSerialization[] =
      await this.productService.serializationList(products);

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

  @Response('product.delete')
  @AclGuard({
    abilities: [
      {
        action: Action.Delete,
        subject: Subjects.Product,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deleteProductBy({ id });
  }

  @Response('product.active')
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.Product,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Patch('active/:id')
  async activeProduct(@Param('id') id: string): Promise<IResponse> {
    const { affected } = await this.productService.updateProductActiveStatus({
      id,
      isActive: true,
    });

    return {
      affected,
    };
  }

  @Response('product.inactive')
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.Product,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Patch('inactive/:id')
  async inactiveProduct(@Param('id') id: string): Promise<IResponse> {
    const { affected } = await this.productService.updateProductActiveStatus({
      id,
      isActive: false,
    });

    return {
      affected,
    };
  }

  @Response('product.update')
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.Product,
      },
    ],
    systemOnly: true,
  })
  @Patch()
  async update(
    @Body()
    body: ProductUpdateDto,
  ): Promise<void> {
    const updateRes = await this.productService.updateProduct(body);

    await this.productService.serialization(updateRes);
  }

  @Response('product.get')
  @AclGuard({
    abilities: [
      {
        action: Action.Read,
        subject: Subjects.Product,
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @Get('/:id')
  async get(
    @Param('id') id: string,
    @Query()
    { lang: language }: ProductGetDto,
  ): Promise<IResponse> {
    const getProduct = await this.productService.get({ id, language });

    return this.productService.serialization(getProduct);
  }
}

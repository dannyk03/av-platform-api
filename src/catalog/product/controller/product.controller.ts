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

import compact from 'lodash/compact';

import { ProductService } from '../service';
import { ProductImageService } from '@/catalog/product-image/service';
import { CloudinaryService } from '@/cloudinary/service';
import { PaginationService } from '@/utils/pagination/service';

import { ProductListSerialization } from '../serialization';

import { ProductCreateDto, ProductListDto, ProductUpdateDto } from '../dto';
import { ProductIdParamDto } from '../dto';
import { ProductGetDto } from '../dto/product.get.dto';

import { AclGuard } from '@/auth';
import { CloudinarySubject } from '@/cloudinary';
import { EnumFileType, UploadFileMultiple } from '@/utils/file';
import { RequestParamGuard } from '@/utils/request';
import {
  IResponse,
  IResponsePaging,
  Response,
  ResponsePaging,
} from '@/utils/response';

import { EnumProductStatusCodeError } from '../product.constant';

@Controller({
  version: '1',
  path: 'product',
})
export class ProductController {
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
  @UploadFileMultiple('images', EnumFileType.Image)
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

    const uploadImages = await Promise.all(
      images.map(async (image) => {
        return this.cloudinaryService.uploadImage({
          subject: CloudinarySubject.Product,
          image,
          languageIsoCode: language,
        });
      }),
    );

    const saveImages = await Promise.all(
      uploadImages.map(async (image) => {
        if (this.cloudinaryService.isUploadApiResponse(image)) {
          return this.productImageService.create({
            fileName: image.original_filename,
            assetId: image.asset_id,
            publicId: image.public_id,
            secureUrl: image.secure_url,
          });
        }

        return Promise.resolve(null);
      }),
    );

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
    return await this.productService.serialization(createdProduct);
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
  @RequestParamGuard(ProductIdParamDto)
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
  @RequestParamGuard(ProductIdParamDto)
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
  @RequestParamGuard(ProductIdParamDto)
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
  @RequestParamGuard(ProductIdParamDto)
  @Get('/:id')
  async get(
    @Param('id') id: string,
    @Query()
    { lang: language }: ProductGetDto,
  ): Promise<IResponse> {
    const getProduct = await this.productService.get({ id, language });

    return await this.productService.serialization(getProduct);
  }
}

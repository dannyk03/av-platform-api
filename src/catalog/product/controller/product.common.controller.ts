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
  UnprocessableEntityException,
  UploadedFiles,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';
import {
  EnumProductStatusCodeError,
  EnumVendorStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { flatMap } from 'lodash';
import compact from 'lodash/compact';

import { ProductService } from '../service';
import { ProductImageService } from '@/catalog/product-image/service';
import { VendorService } from '@/catalog/vendor/service';
import { PaginationService } from '@/utils/pagination/service';

import { ProductGetSerialization } from '../serialization';

import { ProductCreateDto, ProductListDto, ProductUpdateDto } from '../dto';
import { ProductGetDto } from '../dto/product.get.dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard } from '@/auth';
import { EnumFileType, UploadFileMultiple } from '@/utils/file';
import { RequestParamGuard } from '@/utils/request';
import { Response, ResponsePaging } from '@/utils/response';

@Controller({
  version: '1',
})
export class ProductCommonController {
  constructor(
    private readonly productService: ProductService,
    private readonly vendorService: VendorService,
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
  @UploadFileMultiple('images', { type: EnumFileType.IMAGE, required: false })
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
      price,
      currency,
      taxCode,
      shippingCost,
      vendorId,
      vendorName,
    }: ProductCreateDto,
  ): Promise<IResponseData> {
    const checkProductExists = await this.productService.checkExistsBy({ sku });

    if (checkProductExists) {
      throw new BadRequestException({
        statusCode: EnumProductStatusCodeError.ProductExistsError,
        message: 'product.error.exists',
      });
    }

    const checkVendorExists =
      vendorId &&
      (await this.vendorService.checkExistsBy({
        id: vendorId,
      }));

    if (vendorId && !checkVendorExists) {
      throw new BadRequestException({
        statusCode: EnumVendorStatusCodeError.VendorNotFoundError,
        message: 'vendor.error.notFound',
      });
    }

    const saveImages =
      images &&
      (await this.productImageService.createImages({
        images,
        language,
        subFolder: sku,
      }));

    const createProduct = await this.productService.create({
      brand,
      sku,
      price,
      isActive,
      taxCode,
      vendorName,
      shippingCost,
      currency: {
        code: currency,
      },
      displayOptions: [
        {
          language: { isoCode: language },
          keywords: [...new Set(keywords)],
          name,
          description,
          images: saveImages ? compact(saveImages) : null,
        },
      ],
      ...(vendorId && {
        vendor: {
          id: vendorId,
        },
      }),
    });

    const saveProduct = await this.productService.save(createProduct);
    return this.productService.serialization(saveProduct);
  }

  @ResponsePaging('product.list')
  @HttpCode(HttpStatus.OK)
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
      priceRange,
    }: ProductListDto,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const products = await this.productService.paginatedSearchBy({
      language: lang,
      priceRange,
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
      priceRange,
    });

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data: ProductGetSerialization[] =
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
  @HttpCode(HttpStatus.OK)
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
  async activeProduct(@Param('id') id: string): Promise<IResponseData> {
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
  async inactiveProduct(@Param('id') id: string): Promise<IResponseData> {
    const { affected } = await this.productService.updateProductActiveStatus({
      id,
      isActive: false,
    });

    return {
      affected,
    };
  }

  @Response('product.update')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.Product,
      },
    ],
    systemOnly: true,
  })
  @UploadFileMultiple('images', { type: EnumFileType.IMAGE, required: false })
  @RequestParamGuard(IdParamDto)
  @Patch('/:id')
  async update(
    @UploadedFiles() images: Express.Multer.File[],
    @Param('id') id: string,
    @Body()
    { vendorId, deleteImageIds, language, ...restBody }: ProductUpdateDto,
  ): Promise<IResponseData> {
    const existingProduct = await this.productService.findOne({
      where: {
        id,
        displayOptions: {
          language: {
            isoCode: language,
          },
        },
      },
      relations: [
        'displayOptions',
        'displayOptions.images',
        'displayOptions.language',
      ],
    });

    if (!existingProduct) {
      throw new BadRequestException({
        statusCode: EnumProductStatusCodeError.ProductNotFoundError,
        message: 'product.error.notFound',
      });
    }

    const existingVendor =
      vendorId &&
      (await this.vendorService.findOne({
        where: { id: vendorId },
        select: {
          id: true,
        },
      }));

    if (vendorId && !existingVendor) {
      throw new BadRequestException({
        statusCode: EnumVendorStatusCodeError.VendorNotFoundError,
        message: 'vendor.error.notFound',
      });
    }

    const displayOptionByLang = existingProduct.displayOptions.find(
      (opt) => opt?.language?.isoCode === language,
    );

    existingProduct.brand = restBody.brand;
    existingProduct.isActive = restBody.isActive;
    existingProduct.vendorName = restBody.vendorName;
    existingProduct.price = restBody.price;

    displayOptionByLang.description = restBody.description;
    displayOptionByLang.name = restBody.name;
    displayOptionByLang.keywords = restBody.keywords;

    const existingImagesIdsOld = flatMap(displayOptionByLang.images, 'id');
    if (deleteImageIds) {
      displayOptionByLang.images = displayOptionByLang.images?.filter(
        (img) => !deleteImageIds?.includes(img.id),
      );
    }

    const saveImages =
      images &&
      (await this.productImageService.createImages({
        images,
        language,
        subFolder: existingProduct.sku,
      }));

    if (saveImages) {
      displayOptionByLang.images = [
        ...displayOptionByLang.images,
        ...compact(saveImages),
      ];
    }

    // Assign new vendor
    if (existingVendor) {
      existingProduct.vendor = existingVendor;
    }

    // Delete images from Cloudinary
    const idsToDeleteFromCloudinary = deleteImageIds?.filter((id) =>
      existingImagesIdsOld.includes(id),
    );

    if (idsToDeleteFromCloudinary?.length) {
      await this.productImageService.deleteBulkById(idsToDeleteFromCloudinary);
    }

    // Save Updated
    const updateProduct = await this.productService.save(existingProduct);

    return this.productService.serialization(updateProduct);
  }

  @Response('product.get')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/:id')
  async get(
    @Param('id') id: string,
    @Query()
    { lang: language }: ProductGetDto,
  ): Promise<IResponseData> {
    const getProduct = await this.productService.get({ id, language });

    if (!getProduct) {
      throw new UnprocessableEntityException({
        statusCode: EnumProductStatusCodeError.ProductNotFoundError,
        message: 'product.error.notFound',
      });
    }

    return this.productService.serialization(getProduct);
  }
}

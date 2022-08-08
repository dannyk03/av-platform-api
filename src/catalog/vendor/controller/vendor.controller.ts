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
  UploadedFile,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';
import {
  EnumProductStatusCodeError,
  EnumVendorStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import compact from 'lodash/compact';

import { Vendor } from '../entity';

import { VendorLogoService, VendorService } from '../service';
import { ProductService } from '@/catalog/product/service';
import { PaginationService } from '@/utils/pagination/service';

import { VendorCreateDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard } from '@/auth';
import { CloudinarySubject } from '@/cloudinary';
import {
  EnumFileType,
  UploadFileMultiple,
  UploadFileSingle,
} from '@/utils/file';
import { slugify } from '@/utils/helper';
import { RequestParamGuard } from '@/utils/request';
import { Response, ResponsePaging } from '@/utils/response';

@Controller({
  version: '1',
})
export class VendorCommonController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly vendorLogoService: VendorLogoService,
    private readonly productService: ProductService,
    private readonly paginationService: PaginationService,
  ) {}

  @Response('vendor.create')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Create,
        subject: Subjects.Vendor,
      },
    ],
    systemOnly: true,
  })
  @UploadFileSingle('logo', { type: EnumFileType.IMAGE, required: false })
  @Post()
  async create(
    @UploadedFile() logo: Express.Multer.File,
    @Body()
    { name, description, isActive }: VendorCreateDto,
  ): Promise<Vendor> {
    const vendorExists = await this.vendorService.findOneBy({
      slug: slugify(name),
    });

    if (vendorExists) {
      throw new BadRequestException({
        statusCode: EnumVendorStatusCodeError.VendorExistsError,
        message: 'vendor.error.exists',
      });
    }

    const saveLogo = await this.vendorLogoService.createLogo({
      logo,
      subFolder: slugify(name),
    });

    const createVendor = await this.vendorService.create({
      name,
      isActive,
      description,
      logo: saveLogo,
    });

    const saveVendor = await this.vendorService.save(createVendor);

    return saveVendor;
  }

  // @ResponsePaging('product.list')
  // @HttpCode(HttpStatus.OK)
  // @AclGuard({
  //   abilities: [
  //     {
  //       action: Action.Read,
  //       subject: Subjects.Product,
  //     },
  //   ],
  //   systemOnly: true,
  // })
  // @Get('/list')
  // async list(
  //   @Query()
  //   {
  //     lang,
  //     page,
  //     perPage,
  //     sort,
  //     search,
  //     keywords,
  //     availableSort,
  //     availableSearch,
  //     isActive,
  //     priceRange,
  //   }: ProductListDto,
  // ): Promise<IResponsePagingData> {
  //   const skip: number = await this.paginationService.skip(page, perPage);

  //   const products = await this.productService.paginatedSearchBy({
  //     language: lang,
  //     priceRange,
  //     options: {
  //       skip: skip,
  //       take: perPage,
  //       order: sort,
  //     },
  //     search,
  //     keywords,
  //     isActive,
  //   });

  //   const totalData = await this.productService.getTotal({
  //     language: lang,
  //     search,
  //     keywords,
  //     isActive,
  //   });

  //   const totalPage: number = await this.paginationService.totalPage(
  //     totalData,
  //     perPage,
  //   );

  //   const data: ProductListSerialization[] =
  //     await this.productService.serializationList(products);

  //   return {
  //     totalData,
  //     totalPage,
  //     currentPage: page,
  //     perPage,
  //     availableSearch,
  //     availableSort,
  //     data,
  //   };
  // }

  // @Response('product.delete')
  // @HttpCode(HttpStatus.OK)
  // @AclGuard({
  //   abilities: [
  //     {
  //       action: Action.Delete,
  //       subject: Subjects.Product,
  //     },
  //   ],
  //   systemOnly: true,
  // })
  // @RequestParamGuard(IdParamDto)
  // @Delete('/:id')
  // async deleteProduct(@Param('id') id: string): Promise<void> {
  //   await this.productService.deleteProductBy({ id });
  // }

  // @Response('product.active')
  // @AclGuard({
  //   abilities: [
  //     {
  //       action: Action.Update,
  //       subject: Subjects.Product,
  //     },
  //   ],
  //   systemOnly: true,
  // })
  // @RequestParamGuard(IdParamDto)
  // @Patch('active/:id')
  // async activeProduct(@Param('id') id: string): Promise<IResponseData> {
  //   const { affected } = await this.productService.updateProductActiveStatus({
  //     id,
  //     isActive: true,
  //   });

  //   return {
  //     affected,
  //   };
  // }

  // @Response('product.inactive')
  // @AclGuard({
  //   abilities: [
  //     {
  //       action: Action.Update,
  //       subject: Subjects.Product,
  //     },
  //   ],
  //   systemOnly: true,
  // })
  // @RequestParamGuard(IdParamDto)
  // @Patch('inactive/:id')
  // async inactiveProduct(@Param('id') id: string): Promise<IResponseData> {
  //   const { affected } = await this.productService.updateProductActiveStatus({
  //     id,
  //     isActive: false,
  //   });

  //   return {
  //     affected,
  //   };
  // }

  // @Response('product.update')
  // @HttpCode(HttpStatus.OK)
  // @AclGuard({
  //   abilities: [
  //     {
  //       action: Action.Update,
  //       subject: Subjects.Product,
  //     },
  //   ],
  //   systemOnly: true,
  // })
  // @Patch()
  // async update(
  //   @Body()
  //   body: ProductUpdateDto,
  // ): Promise<void> {
  //   const updateRes = await this.productService.updateProduct(body);

  //   await this.productService.serialization(updateRes);
  // }

  // @Response('product.get')
  // @HttpCode(HttpStatus.OK)
  // @AclGuard({
  //   abilities: [
  //     {
  //       action: Action.Read,
  //       subject: Subjects.Product,
  //     },
  //   ],
  // })
  // @RequestParamGuard(IdParamDto)
  // @Get('/:id')
  // async get(
  //   @Param('id') id: string,
  //   @Query()
  //   { lang: language }: ProductGetDto,
  // ): Promise<IResponseData> {
  //   const getProduct = await this.productService.get({ id, language });

  //   return this.productService.serialization(getProduct);
  // }
}

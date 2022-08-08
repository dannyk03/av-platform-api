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

import { VendorListSerialization } from '../serialization';

import { VendorCreateDto, VendorListDto } from '../dto';
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
  ): Promise<IResponseData> {
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

    return this.vendorService.serialization(saveVendor);
  }

  @ResponsePaging('vendor.list')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Read,
        subject: Subjects.Vendor,
      },
    ],
    systemOnly: true,
  })
  @Get('/list')
  async list(
    @Query()
    {
      page,
      perPage,
      sort,
      search,
      availableSort,
      availableSearch,
      isActive,
    }: VendorListDto,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const products = await this.vendorService.paginatedSearchBy({
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
      search,
      isActive,
    });

    const totalData = await this.vendorService.getTotal({
      search,
      isActive,
    });

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data: VendorListSerialization[] =
      await this.vendorService.serializationList(products);

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

  @Response('vendor.delete')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Delete,
        subject: Subjects.Vendor,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.vendorService.deleteById(id);
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
    const { affected } = await this.vendorService.updateVendorActiveStatus({
      id,
      isActive: true,
    });

    return {
      affected,
    };
  }

  @Response('vendor.inactive')
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.Vendor,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Patch('inactive/:id')
  async inactiveProduct(@Param('id') id: string): Promise<IResponseData> {
    const { affected } = await this.vendorService.updateVendorActiveStatus({
      id,
      isActive: false,
    });

    return {
      affected,
    };
  }

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

  @Response('vendor.get')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Read,
        subject: Subjects.Vendor,
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @Get('/:id')
  async get(@Param('id') id: string): Promise<IResponseData> {
    const getVendor = await this.vendorService.get({ id });

    // return getVendor;
    return this.vendorService.serialization(getVendor);
  }
}

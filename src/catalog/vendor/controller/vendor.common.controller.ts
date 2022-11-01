import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';
import {
  EnumVendorStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { VendorLogoService, VendorService } from '../service';
import { HelperHashService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { UploadFileSingle } from '@/utils/file/decorators';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { IFile } from '@/utils/file/type';

import { VendorCreateDto, VendorListDto, VendorUpdateDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto';

import { VendorGetSerialization } from '../serialization';

import {
  FileRequiredPipe,
  FileSizeImagePipe,
  FileTypeImagePipe,
} from '@/utils/file/pipes';
import { slugify } from '@/utils/helper';

@Controller({
  version: '1',
})
export class VendorCommonController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly vendorLogoService: VendorLogoService,
    private readonly paginationService: PaginationService,
    private readonly helperHashService: HelperHashService,
  ) {}

  @ClientResponse('vendor.create', {
    classSerialization: VendorGetSerialization,
  })
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
  @UploadFileSingle('logo')
  @Post()
  async create(
    @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
    logo: IFile,
    @Body()
    { name, description, isActive }: VendorCreateDto,
  ): Promise<IResponseData> {
    const vendorSlug = slugify(name);
    const vendorExists = await this.vendorService.findOneBy({
      slug: vendorSlug,
    });

    if (vendorExists) {
      throw new BadRequestException({
        statusCode: EnumVendorStatusCodeError.VendorExistsError,
        message: 'vendor.error.exists',
      });
    }

    // Rename image
    if (logo) {
      logo.originalname = `${vendorSlug}_logo.${
        logo.originalname.split('.')[1]
      }`;
    }

    const saveLogo = logo
      ? await this.vendorLogoService.createLogo({
          logo,
          subFolder: await this.helperHashService.uuidV5(name),
        })
      : undefined;

    const createVendor = await this.vendorService.create({
      name,
      isActive,
      description,
      logo: saveLogo,
    });

    return this.vendorService.save(createVendor);
  }

  @ClientResponsePaging('vendor.list', {
    classSerialization: VendorGetSerialization,
  })
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

    const vendors = await this.vendorService.paginatedSearchBy({
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

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data: vendors,
    };
  }

  @ClientResponse('vendor.delete')
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
  async delete(@Param('id') id: string): Promise<void> {
    await this.vendorService.deleteBy({ id });
  }

  @ClientResponse('vendor.active')
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
  @Patch('active/:id')
  async active(@Param('id') id: string): Promise<IResponseData> {
    const { affected } = await this.vendorService.updateVendorActiveStatus({
      id,
      isActive: true,
    });

    return {
      updated: affected,
    };
  }

  @ClientResponse('vendor.inactive')
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
  async inactive(@Param('id') id: string): Promise<IResponseData> {
    const { affected } = await this.vendorService.updateVendorActiveStatus({
      id,
      isActive: false,
    });

    return {
      updated: affected,
    };
  }

  @ClientResponse('vendor.update', {
    classSerialization: VendorGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.Vendor,
      },
    ],
    systemOnly: true,
  })
  @Patch()
  async update(
    @Body()
    body: VendorUpdateDto,
  ): Promise<IResponseData> {
    const { affected } = await this.vendorService.update(body);

    return {
      updated: affected,
    };
  }

  @ClientResponse('vendor.get', { classSerialization: VendorGetSerialization })
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
  async get(
    @Param('id')
    id: string,
  ): Promise<IResponseData> {
    const vendor = await this.vendorService.get({ id });

    if (!vendor) {
      throw new NotFoundException({
        statusCode: EnumVendorStatusCodeError.VendorNotFoundError,
        message: 'vendor.error.notFound',
      });
    }

    return vendor;
  }
}

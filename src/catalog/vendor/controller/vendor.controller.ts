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
  EnumVendorStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { VendorLogoService, VendorService } from '../service';
import { PaginationService } from '@/utils/pagination/service';

import { VendorGetSerialization } from '../serialization';

import { VendorCreateDto, VendorListDto, VendorUpdateDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard } from '@/auth';
import { EnumFileType, UploadFileSingle } from '@/utils/file';
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

    // Rename
    logo.originalname = `${vendorSlug}_logo.${logo.originalname.split('.')[1]}`;

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

    const data: VendorGetSerialization[] =
      await this.vendorService.serializationList(vendors);

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
  async delete(@Param('id') id: string): Promise<void> {
    await this.vendorService.deleteBy({ id });
  }

  @Response('vendor.active')
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
  async inactive(@Param('id') id: string): Promise<IResponseData> {
    const { affected } = await this.vendorService.updateVendorActiveStatus({
      id,
      isActive: false,
    });

    return {
      affected,
    };
  }

  @Response('vendor.update')
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
  ): Promise<void> {
    const updateRes = await this.vendorService.update(body);

    await this.vendorService.serialization(updateRes);
  }

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

    return this.vendorService.serialization(getVendor);
  }
}

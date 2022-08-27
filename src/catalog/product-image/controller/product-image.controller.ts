import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFiles,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';
import { EnumProductStatusCodeError, IResponseData } from '@avo/type';

import { ProductImageService } from '../service';
import { CloudinaryService } from '@/cloudinary/service';

import { ClientResponse } from '@/utils/response/decorators';

import { AclGuard } from '@/auth/guards';
import { RequestParamGuard } from '@/utils/request/guard';

import { ProductImageBulkDeleteDto, ProductImageUpdateDto } from '../dto';
import { ProductGetDto } from '@/catalog/product/dto/product.get.dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { ProductImageGetSerialization } from '../serialization';

import { EnumFileType, UploadFileMultiple } from '@/utils/file';

@Controller({
  version: '1',
  path: 'image',
})
export class ProductImageController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productImageService: ProductImageService,
  ) {}

  @ClientResponse('product.imageDelete')
  @AclGuard({
    abilities: [
      {
        action: Action.Delete,
        subject: Subjects.ProductImage,
      },
    ],
    systemOnly: true,
  })
  @Delete('/bulk')
  async imageDeleteBulk(
    @Body() { ids }: ProductImageBulkDeleteDto,
  ): Promise<void> {
    await this.productImageService.deleteBulkById(ids);
  }

  @ClientResponse('product.imageAdd')
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.ProductImage,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @UploadFileMultiple('images', { type: EnumFileType.IMAGE, required: true })
  @Post('/:id')
  async imageAdd(
    @Param('id') productId: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Query()
    { lang: language }: ProductGetDto,
  ): Promise<void> {
    await this.productImageService.saveImages({
      id: productId,
      images,
      language,
    });
  }

  @ClientResponse('product.imageDelete')
  @AclGuard({
    abilities: [
      {
        action: Action.Delete,
        subject: Subjects.ProductImage,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Delete('/:id')
  async imageDelete(@Param('id') id: string): Promise<void> {
    await this.productImageService.deleteById(id);
  }

  @ClientResponse('product.updateImage', {
    classSerialization: ProductImageGetSerialization,
  })
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.ProductImage,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Patch('/:id')
  async setImageWeight(
    @Param('id') imageId: string,
    @Body() body: ProductImageUpdateDto,
  ): Promise<IResponseData> {
    const findImage = await this.productImageService.findOneBy({ id: imageId });

    if (!findImage) {
      throw new UnprocessableEntityException({
        statusCode: EnumProductStatusCodeError.ProductImageNotFoundError,
        message: 'product.error.image',
      });
    }

    const saveImage = await this.productImageService.save({
      ...findImage,
      ...body,
    });

    return saveImage;
  }
}

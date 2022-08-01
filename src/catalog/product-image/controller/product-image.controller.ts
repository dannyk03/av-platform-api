import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';

import { ProductImageService } from '../service';
import { CloudinaryService } from '@/cloudinary/service';

import { ImageBulkDeleteDto } from '../dto';
import { ProductGetDto } from '@/catalog/product/dto/product.get.dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard } from '@/auth';
import { EnumFileType, UploadFileMultiple } from '@/utils/file';
import { RequestParamGuard } from '@/utils/request';
import { Response } from '@/utils/response';

@Controller({
  version: '1',
  path: 'image',
})
export class ProductImageController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productImageService: ProductImageService,
  ) {}

  @Response('product.imageDelete')
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
  async imageDeleteBulk(@Body() { ids }: ImageBulkDeleteDto): Promise<void> {
    await this.productImageService.deleteBulkById(ids);
  }

  @Response('product.imageAdd')
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
  @UploadFileMultiple('images', EnumFileType.Image, true)
  @Post('/:id')
  async imageAdd(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Query()
    { lang: language }: ProductGetDto,
  ): Promise<void> {
    await this.productImageService.saveImages({
      id,
      images,
      language,
    });
  }

  @Response('product.imageDelete')
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
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductDisplayOptionModule } from '../product-display-option/product-display-option.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';

import { ProductImage } from '../product-image/entity';

import { ProductImageService } from '../product-image/service';
import { CloudinaryService } from '@/cloudinary/service';

import { ConnectionNames } from '@/database/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage], ConnectionNames.Default),
    DisplayLanguageModule,
    ProductDisplayOptionModule,
  ],
  providers: [CloudinaryService, ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}

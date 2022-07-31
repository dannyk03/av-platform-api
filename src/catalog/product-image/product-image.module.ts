import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DisplayLanguageModule } from '@/language/display-language/display-language.module';

import { ProductImage } from '../product-image/entity';

import { ProductImageService } from '../product-image/service';
import { CloudinaryService } from '@/cloudinary/service';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage], ConnectionNames.Default),
    DisplayLanguageModule,
  ],
  providers: [CloudinaryService, ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}

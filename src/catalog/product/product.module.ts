import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageModule } from '../product-image/product-image.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';

import { Product } from './entity';

import { ProductService } from './service';
import { CloudinaryService } from '@/cloudinary/service';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product], ConnectionNames.Default),
    ProductImageModule,
    DisplayLanguageModule,
  ],
  providers: [CloudinaryService, ProductService],
  exports: [ProductService],
})
export class ProductModule {}

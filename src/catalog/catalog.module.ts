import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageService } from './product-image/service';
import { ProductService } from './product/service';
import { CatalogService } from './service';
import { CloudinaryService } from '@/cloudinary/service';

import { ProductDisplayOption } from './product-display-option/entity';
import { ProductImage } from './product-image/entity';
import { Product } from './product/entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Product, ProductDisplayOption, ProductImage],
      ConnectionNames.Default,
    ),
  ],
  exports: [CatalogService, ProductService, ProductImageService],
  providers: [
    CatalogService,
    ProductService,
    ProductImageService,
    CloudinaryService,
  ],
  controllers: [],
})
export class CatalogModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryService } from '@/cloudinary/service';
import { ConnectionNames } from '@/database';

import { ProductDisplayOption } from './product-display-option/entity';
import { ProductImage } from './product-image/entity';
import { ProductImageService } from './product-image/service';
import { Product } from './product/entity';
import { ProductService } from './product/service';
import { CatalogService } from './service';

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

import { Module } from '@nestjs/common';

import { ConnectionNames } from '$/database';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { CloudinaryService } from '$/cloudinary/service';
import { ProductImageService } from './product-image/service';
import { ProductService } from './product/service';
import { CatalogService } from './service';
// Entities
import { ProductDisplayOption } from './product-display-option/entity';
import { ProductImage } from './product-image/entity';
import { Product } from './product/entity';

//

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

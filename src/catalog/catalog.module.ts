import { Module } from '@nestjs/common';

import { ConnectionNames } from '@/database';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { CatalogService } from './service/catalog.service';
// Entities
import { Product } from './entity/product.entity';

//

@Module({
  imports: [TypeOrmModule.forFeature([Product], ConnectionNames.Default)],
  exports: [CatalogService],
  providers: [CatalogService],
  controllers: [],
})
export class CatalogModule {}

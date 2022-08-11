import { Module } from '@nestjs/common';

import { CatalogService } from './service';
import { CloudinaryService } from '@/cloudinary/service';

@Module({
  imports: [],
  exports: [CatalogService],
  providers: [CatalogService, CloudinaryService],
  controllers: [],
})
export class CatalogModule {}

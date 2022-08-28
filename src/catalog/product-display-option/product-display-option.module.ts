import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductDisplayOption } from './entity';

import { ProductDisplayOptionService } from './service';
import { CloudinaryService } from '@/cloudinary/service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDisplayOption], ConnectionNames.Default),
  ],
  providers: [CloudinaryService, ProductDisplayOptionService],
  exports: [ProductDisplayOptionService],
})
export class ProductDisplayOptionModule {}

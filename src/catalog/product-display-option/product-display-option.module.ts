import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductDisplayOption } from './entity';

import { CloudinaryService } from '@/cloudinary/service';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDisplayOption], ConnectionNames.Default),
  ],
  providers: [CloudinaryService],
  exports: [],
})
export class ProductDisplayOptionModule {}

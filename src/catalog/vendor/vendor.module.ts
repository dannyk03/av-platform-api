import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vendor } from './entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor], ConnectionNames.Default)],
  providers: [],
  exports: [],
})
export class VendorModule {}

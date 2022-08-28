import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vendor, VendorLogo } from './entity';

import { VendorLogoService, VendorService } from './service';
import { CloudinaryService } from '@/cloudinary/service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, VendorLogo], ConnectionNames.Default),
  ],
  providers: [CloudinaryService, VendorService, VendorLogoService],
  exports: [VendorService, VendorLogoService],
})
export class VendorModule {}

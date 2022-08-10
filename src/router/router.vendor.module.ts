import { Module } from '@nestjs/common';

import { ProductModule } from '@/catalog/product/product.module';
import { VendorModule } from '@/catalog/vendor/vendor.module';
import { UserModule } from '@/user/user.module';

import { CloudinaryService } from '@/cloudinary/service';

import { VendorCommonController } from '@/catalog/vendor/controller';

@Module({
  controllers: [VendorCommonController],
  providers: [CloudinaryService],
  exports: [],
  imports: [UserModule, VendorModule, ProductModule],
})
export class RouterVendorModule {}

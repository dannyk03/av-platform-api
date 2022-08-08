import { Module } from '@nestjs/common';

import { ProductDisplayOptionModule } from '@/catalog/product-display-option/product-display-option.module';
import { ProductImageModule } from '@/catalog/product-image/product-image.module';
import { ProductModule } from '@/catalog/product/product.module';
import { VendorModule } from '@/catalog/vendor/vendor.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
import { UserModule } from '@/user/user.module';

import { VendorService } from '@/catalog/vendor/service';
import { CloudinaryService } from '@/cloudinary/service';

import { ProductImageController } from '@/catalog/product-image/controller';
import { ProductCommonController } from '@/catalog/product/controller';
import { VendorCommonController } from '@/catalog/vendor/controller';

@Module({
  controllers: [VendorCommonController],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    VendorModule,
    // ProductModule,
    // ProductImageModule,
    // DisplayLanguageModule,
    // ProductDisplayOptionModule,
  ],
})
export class RouterVendorModule {}

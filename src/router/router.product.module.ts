import { Module } from '@nestjs/common';

import { ProductDisplayOptionModule } from '@/catalog/product-display-option/product-display-option.module';
import { ProductImageModule } from '@/catalog/product-image/product-image.module';
import { ProductModule } from '@/catalog/product/product.module';
import { VendorModule } from '@/catalog/vendor/vendor.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
import { UserModule } from '@/user/user.module';

import { CloudinaryService } from '@/cloudinary/service';

import { ProductImageController } from '@/catalog/product-image/controller';
import { ProductCommonController } from '@/catalog/product/controller';

@Module({
  controllers: [ProductCommonController, ProductImageController],
  providers: [CloudinaryService],
  exports: [],
  imports: [
    UserModule,
    VendorModule,
    ProductModule,
    ProductImageModule,
    DisplayLanguageModule,
    ProductDisplayOptionModule,
  ],
})
export class RouterProductModule {}

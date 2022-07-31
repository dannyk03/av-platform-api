import { Module } from '@nestjs/common';

import { ProductDisplayOptionModule } from '@/catalog/product-display-option/product-display-option.module';
import { ProductImageModule } from '@/catalog/product-image/product-image.module';
import { ProductModule } from '@/catalog/product/product.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
import { UserModule } from '@/user/user.module';

import { CloudinaryService } from '@/cloudinary/service';

import { ProductController } from '@/catalog/product/controller';

@Module({
  controllers: [ProductController],
  providers: [CloudinaryService],
  exports: [],
  imports: [
    UserModule,
    ProductModule,
    ProductImageModule,
    DisplayLanguageModule,
    ProductDisplayOptionModule,
  ],
})
export class RouterProductModule {}

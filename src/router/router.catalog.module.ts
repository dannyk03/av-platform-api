import { Module } from '@nestjs/common';

import { CatalogModule } from '@/catalog/catalog.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
import { UserModule } from '@/user/user.module';

import { CloudinaryService } from '@/cloudinary/service';

import { ProductController } from '@/catalog/product/controller';

@Module({
  controllers: [ProductController],
  providers: [CloudinaryService],
  exports: [],
  imports: [UserModule, CatalogModule, DisplayLanguageModule],
})
export class RouterCatalogModule {}

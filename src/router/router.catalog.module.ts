import { Module } from '@nestjs/common';

import { CatalogModule } from '@/catalog/catalog.module';
import { ProductController } from '@/catalog/product/controller';
import { CloudinaryService } from '@/cloudinary/service';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
import { UserModule } from '@/user/user.module';

@Module({
  controllers: [ProductController],
  providers: [CloudinaryService],
  exports: [],
  imports: [UserModule, CatalogModule, DisplayLanguageModule],
})
export class RouterCatalogModule {}

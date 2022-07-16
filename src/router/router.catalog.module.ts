import { Module } from '@nestjs/common';
// Modules
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
import { ProductController } from '@/catalog/controller/product.controller';
import { UserModule } from '@/user/user.module';
//

@Module({
  controllers: [ProductController],
  providers: [],
  exports: [],
  imports: [UserModule, DisplayLanguageModule],
})
export class RouterCatalogModule {}

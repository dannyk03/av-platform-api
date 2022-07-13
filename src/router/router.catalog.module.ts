import { Module } from '@nestjs/common';
// Modules
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
//

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [DisplayLanguageModule],
})
export class RouterCatalogModule {}

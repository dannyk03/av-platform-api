import { Module } from '@nestjs/common';

import { ConnectionNames } from '@/database';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { DisplayLanguageService } from './service/display-language.service';
// Entities
import { DisplayLanguage } from './entity';
//

@Module({
  imports: [
    TypeOrmModule.forFeature([DisplayLanguage], ConnectionNames.Default),
  ],
  exports: [DisplayLanguageService],
  providers: [DisplayLanguageService],
  controllers: [],
})
export class DisplayLanguageModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionNames } from '@/database';

import { DisplayLanguage } from './entity';
import { DisplayLanguageService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisplayLanguage], ConnectionNames.Default),
  ],
  exports: [DisplayLanguageService],
  providers: [DisplayLanguageService],
  controllers: [],
})
export class DisplayLanguageModule {}

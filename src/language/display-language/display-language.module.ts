import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DisplayLanguageService } from './service';

import { DisplayLanguage } from './entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisplayLanguage], ConnectionNames.Default),
  ],
  exports: [DisplayLanguageService],
  providers: [DisplayLanguageService],
  controllers: [],
})
export class DisplayLanguageModule {}

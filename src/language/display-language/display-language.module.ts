import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DisplayLanguage } from './entity';

import { DisplayLanguageService } from './service';

import { ConnectionNames } from '@/database/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisplayLanguage], ConnectionNames.Default),
  ],
  exports: [DisplayLanguageService],
  providers: [DisplayLanguageService],
  controllers: [],
})
export class DisplayLanguageModule {}

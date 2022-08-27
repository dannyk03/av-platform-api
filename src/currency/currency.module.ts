import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Currency } from './entity';

import { CurrencyService } from './service';

import { ConnectionNames } from '@/database/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Currency], ConnectionNames.Default)],
  exports: [CurrencyService],
  providers: [CurrencyService],
  controllers: [],
})
export class CurrencyModule {}

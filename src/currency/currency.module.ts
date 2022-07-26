import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyService } from './service';

import { Currency } from './entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([Currency], ConnectionNames.Default)],
  exports: [CurrencyService],
  providers: [CurrencyService],
  controllers: [],
})
export class CurrencyModule {}

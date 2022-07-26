import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionNames } from '@/database';

import { Currency } from './entity';
import { CurrencyService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Currency], ConnectionNames.Default)],
  exports: [CurrencyService],
  providers: [CurrencyService],
  controllers: [],
})
export class CurrencyModule {}

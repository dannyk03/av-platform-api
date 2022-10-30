import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/user/user.module';

import { GiftOrder } from './entity';

import { GiftOrderService } from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftOrder], ConnectionNames.Default),
    UserModule,
  ],
  exports: [GiftOrderService],
  providers: [GiftOrderService],
  controllers: [],
})
export class OrderModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagingModule } from '@/messaging/messaging.module';
import { UserModule } from '@/user/user.module';

import { GiftOrder } from './entity';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftOrder], ConnectionNames.Default),
    MessagingModule,
    UserModule,
  ],
  exports: [],
  providers: [],
  controllers: [],
})
export class OrderModule {}

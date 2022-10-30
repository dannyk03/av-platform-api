import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ProductModule } from '@/catalog/product/product.module';
import { GiftModule } from '@/gifting/gift.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { NetworkingModule } from '@/networking/networking.module';
import { OrderModule } from '@/order/order.module';
import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { GiftingCommonController } from '@/gifting/controller';

@Module({
  controllers: [GiftingCommonController],
  providers: [],
  exports: [],
  imports: [
    HttpModule,
    GiftModule,
    MessagingModule,
    AclRoleModule,
    UserModule,
    ProductModule,
    NetworkingModule,
    OrderModule,
  ],
})
export class RouterGiftingModule {}

import { Module } from '@nestjs/common';

import { ProductModule } from '@/catalog/product/product.module';
import { ConnectionModule } from '@/connection/connection.module';
import { GiftModule } from '@/gifting/gift.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { OrderModule } from '@/order/order.module';
import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { GiftingCommonController } from '@/gifting/controller';

@Module({
  controllers: [GiftingCommonController],
  providers: [],
  exports: [],
  imports: [
    GiftModule,
    MessagingModule,
    AclRoleModule,
    UserModule,
    ProductModule,
    ConnectionModule,
    OrderModule,
  ],
})
export class RouterGiftingModule {}

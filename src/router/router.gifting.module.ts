import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ProductModule } from '@/catalog/product/product.module';
import { GiftModule } from '@/gifting/gift.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { GiftingSystemController } from '@/gifting/controller';

@Module({
  controllers: [GiftingSystemController],
  providers: [],
  exports: [],
  imports: [
    HttpModule,
    GiftModule,
    MessagingModule,
    AclRoleModule,
    UserModule,
    ProductModule,
  ],
})
export class RouterGiftingModule {}

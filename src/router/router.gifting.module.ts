import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ProductModule } from '@/catalog/product/product.module';
import { GiftModule } from '@/gifting/gift/gift.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { GiftCommonController } from '@/gifting/gift/controller';

@Module({
  controllers: [GiftCommonController],
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

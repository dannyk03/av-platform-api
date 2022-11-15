import { Module } from '@nestjs/common';

import { ProductModule } from '@/catalog/product/product.module';
import { GiftModule } from '@/gifting/gift.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { GiftingSystemCommonController } from '@/gifting/controller';

@Module({
  controllers: [GiftingSystemCommonController],
  providers: [],
  exports: [],
  imports: [
    GiftModule,
    MessagingModule,
    AclRoleModule,
    UserModule,
    ProductModule,
  ],
})
export class RouterGiftingSystemModule {}

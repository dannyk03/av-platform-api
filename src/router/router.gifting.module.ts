import { Module } from '@nestjs/common';
// Modules
import { AclRoleModule } from '@acl/role/acl-role.module';
import { UserModule } from '@/user/user.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { GiftModule } from '@/gifting/gift/gift.module';
// Controllers
import { GiftController } from '@/gifting/gift/controller/gift-common.controller';
//

@Module({
  controllers: [GiftController],
  providers: [],
  exports: [],
  imports: [GiftModule, MessagingModule, AclRoleModule, UserModule],
})
export class RouterGiftingModule {}

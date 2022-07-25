import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// Modules
import { AclRoleModule } from '@acl/role/acl-role.module';
import { UserModule } from '@/user/user.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { GiftModule } from '@/gifting/gift/gift.module';
// Controllers
import { GiftController } from '@/gifting/gift/controller';
//

@Module({
  controllers: [GiftController],
  providers: [],
  exports: [],
  imports: [HttpModule, GiftModule, MessagingModule, AclRoleModule, UserModule],
})
export class RouterGiftingModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
// Modules
import { GiftModule } from '$/gifting/gift/gift.module';
import { MessagingModule } from '$/messaging/messaging.module';
import { UserModule } from '$/user/user.module';
import { AclRoleModule } from '$acl/role/acl-role.module';
// Controllers
import { GiftController } from '$/gifting/gift/controller';
//

@Module({
  controllers: [GiftController],
  providers: [],
  exports: [],
  imports: [HttpModule, GiftModule, MessagingModule, AclRoleModule, UserModule],
})
export class RouterGiftingModule {}

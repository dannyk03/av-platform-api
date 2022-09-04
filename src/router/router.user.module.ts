import { Module } from '@nestjs/common';

import { MessagingModule } from '@/messaging/messaging.module';
import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { UserCommonController } from '@/user/controller';

@Module({
  controllers: [UserCommonController],
  providers: [],
  exports: [],
  imports: [AclRoleModule, UserModule, MessagingModule, NetworkingModule],
})
export class RouterUserModule {}

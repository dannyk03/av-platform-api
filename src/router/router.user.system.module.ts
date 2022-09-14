import { Module } from '@nestjs/common';

import { MessagingModule } from '@/messaging/messaging.module';
import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { UserSystemCommonController } from '@/user/controller';

@Module({
  controllers: [UserSystemCommonController],
  providers: [],
  exports: [],
  imports: [AclRoleModule, UserModule, MessagingModule],
})
export class RouterUserSystemModule {}

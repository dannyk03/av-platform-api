import { Module } from '@nestjs/common';

import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { UserSystemCommonController } from '@/user/controller';

@Module({
  controllers: [UserSystemCommonController],
  providers: [],
  exports: [],
  imports: [AclRoleModule, UserModule],
})
export class RouterUserSystemModule {}

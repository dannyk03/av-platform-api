import { Module } from '@nestjs/common';

import { UserModule } from '@/user/user.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { UserCommonController } from '@/user/controller';

@Module({
  controllers: [UserCommonController],
  providers: [],
  exports: [],
  imports: [AclRoleModule, UserModule],
})
export class RouterUserModule {}

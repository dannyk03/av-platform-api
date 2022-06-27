import { Module } from '@nestjs/common';
// Modules
import { AuthModule } from '@/auth/auth.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
import { OrganizationModule } from '@/organization/organization.module';
import { UserModule } from '@/user/user.module';
// Controllers
import { UserAdminController } from '@/user/controller';
import { AclRoleController } from '@acl/role/controller';
import { OrganizationAdminController } from '@/organization/controller';
//

@Module({
  controllers: [
    OrganizationAdminController,
    UserAdminController,
    AclRoleController,
  ],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    AclRoleModule,
    AclPolicyModule,
    AclSubjectModule,
    AclAbilityModule,
    UserModule,
    OrganizationModule,
  ],
})
export class RouterAdminModule {}

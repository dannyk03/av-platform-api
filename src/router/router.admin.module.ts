import { Module } from '@nestjs/common';
// Modules
import { AuthModule } from '@/auth/auth.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
import { OrganizationModule } from '@/organization/organization.module';
import { UserModule } from '@/user/user.module';
import { MessagingModule } from '@/messaging/messaging.module';
// Controllers
import { UserController } from '@/user/controller';
import { AclRoleController } from '@acl/role/controller';
//

@Module({
  controllers: [UserController, AclRoleController],
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
    MessagingModule,
  ],
})
export class RouterAdminModule {}

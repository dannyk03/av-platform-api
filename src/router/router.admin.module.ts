import { Module } from '@nestjs/common';
// Modules
import { AuthModule } from '@/auth/auth.module';
import { AcpRoleModule } from '@acp/role/acp-role.module';
import { AcpPolicyModule } from '@acp/policy/acp-policy.module';
import { AcpSubjectModule } from '@acp/subject/acp-subject.module';
import { AcpAbilityModule } from '@acp/ability/acp-ability.module';
import { OrganizationModule } from '@/organization/organization.module';
import { UserModule } from '@/user/user.module';
//
import { UserAdminController } from '@/user';
import { OrganizationAdminController } from '@/organization';

@Module({
  controllers: [OrganizationAdminController, UserAdminController],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    AcpRoleModule,
    AcpPolicyModule,
    AcpSubjectModule,
    AcpAbilityModule,
    UserModule,
    OrganizationModule,
  ],
})
export class RouterAdminModule {}

import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
// Modules
import { CoreModule } from '@/core/core.module';
import { AcpAbilityModule } from '@acp/ability/acp-ability.module';
import { AcpPolicyModule } from '@acp/policy/acp-policy.module';
import { AcpRoleModule } from '@acp/role/acp-role.module';
import { AcpSubjectModule } from '@acp/subject/acp-subject.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { OrganizationModule } from '@/organization/organization.module';
//
import { SystemSeed } from './system.seed';
import { RolePresetsSeed } from './role-presets.seed';

@Module({
  imports: [
    CoreModule,
    CommandModule,
    AuthModule,
    OrganizationModule,
    UserModule,
    AcpRoleModule,
    AcpPolicyModule,
    AcpSubjectModule,
    AcpAbilityModule,
  ],
  providers: [SystemSeed, RolePresetsSeed],
  exports: [],
})
export class SeedsModule {}

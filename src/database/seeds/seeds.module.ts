import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
// Modules
import { CoreModule } from '@/core/core.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { OrganizationModule } from '@/organization/organization.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
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
    AclRoleModule,
    AclPolicyModule,
    AclSubjectModule,
    AclAbilityModule,
    DisplayLanguageModule,
  ],
  providers: [SystemSeed, RolePresetsSeed],
  exports: [],
})
export class SeedsModule {}

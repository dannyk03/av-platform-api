import { Module } from '@nestjs/common';

import { CommandModule } from 'nestjs-command';

import { AuthModule } from '@/auth/auth.module';
import { CoreModule } from '@/core/core.module';
import { CurrencyModule } from '@/currency/currency.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
import { OrganizationModule } from '@/organization/organization.module';
import { UserModule } from '@/user/user.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';

import { CreateDbSeed } from './create-db.seed';
import { RolePresetsSeed } from './role-presets.seed';
import { SystemSeed } from './system.seed';

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
    CurrencyModule,
  ],
  providers: [CreateDbSeed, SystemSeed, RolePresetsSeed],
  exports: [],
})
export class SeedsModule {}

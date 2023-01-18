import { Module } from '@nestjs/common';

import { CommandModule } from 'nestjs-command';

import { AuthModule } from '@/auth/auth.module';
import { ProductModule } from '@/catalog/product/product.module';
import { CommonModule } from '@/common/common.module';
import { CurrencyModule } from '@/currency/currency.module';
import { GroupModule } from '@/group/group.module';
import { DisplayLanguageModule } from '@/language/display-language/display-language.module';
import { NetworkingModule } from '@/networking/networking.module';
import { OrganizationModule } from '@/organization/organization.module';
import { UserModule } from '@/user/user.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';

import {
  StringEscapeRevertGroupsCommandService,
  StringEscapeRevertProductsCommandService,
  StringEscapeRevertUsersCommandService,
} from './command/service';
import {
  InvitationLinkSeedService,
  RolePresetsSeedService,
  SystemSeedService,
} from './seed/service';

import { CreateDbSeed } from './create-db.seed';
import { RolePresetsSeed } from './role-presets.seed';
import { SystemSeed } from './system.seed';

@Module({
  imports: [
    CommonModule,
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
    NetworkingModule,
    GroupModule,
    ProductModule,
  ],
  providers: [
    SystemSeedService,
    RolePresetsSeedService,
    InvitationLinkSeedService,
    CreateDbSeed,
    SystemSeed,
    RolePresetsSeed,
    StringEscapeRevertUsersCommandService,
    StringEscapeRevertGroupsCommandService,
    StringEscapeRevertProductsCommandService,
  ],
  exports: [],
})
export class CommandsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AclAbilityModule } from '@acl/ability/acl-ability.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';

import { AclRole, AclRolePreset } from './entity';

import { AclRolePresetService, AclRoleService } from './service';

import { ConnectionNames } from '@/database/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([AclRole, AclRolePreset], ConnectionNames.Default),
    AclPolicyModule,
    AclSubjectModule,
    AclAbilityModule,
  ],
  exports: [AclRoleService, AclRolePresetService],
  providers: [AclRoleService, AclRolePresetService],
  controllers: [],
})
export class AclRoleModule {}

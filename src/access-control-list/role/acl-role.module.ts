import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { AclRoleService } from './service/acl-role.service';
import { AclRolePresetService } from './service/acl-role-preset.service';
// Modules
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
//
import { ConnectionNames } from '@/database';
import { AclRole } from './entity/acl-role.entity';
import { AclRolePreset } from './entity/acl-role-preset.entity';

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

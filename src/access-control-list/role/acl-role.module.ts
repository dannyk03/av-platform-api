import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Modules
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
// Entities
import { AclRole, AclRolePreset } from './entity';
// Services
import { AclRoleService, AclRolePresetService } from './service';
//
import { ConnectionNames } from '@/database';

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

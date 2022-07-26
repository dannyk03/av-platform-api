import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Modules
import { AclAbilityModule } from '$acl/ability/acl-ability.module';
import { AclPolicyModule } from '$acl/policy/acl-policy.module';
import { AclSubjectModule } from '$acl/subject/acl-subject.module';
// Entities
import { AclRole, AclRolePreset } from './entity';
// Services
import { AclRolePresetService, AclRoleService } from './service';
//
import { ConnectionNames } from '$/database';

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

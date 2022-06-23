import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { AcpRole } from './entity/acp-role.entity';
import { AcpRoleService } from './service/acp-role.service';
import { AcpRolePresetService } from './service/acp-role-preset.service';
import { AcpRolePreset } from './entity/acp-role-preset.entity';
import { AcpPolicyModule } from '@acp/policy/acp-policy.module';
import { AcpSubjectModule } from '@acp/subject/acp-subject.module';
import { AcpAbilityModule } from '@acp/ability/acp-ability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AcpRole, AcpRolePreset], ConnectionNames.Default),
    AcpPolicyModule,
    AcpSubjectModule,
    AcpAbilityModule,
  ],
  exports: [AcpRoleService, AcpRolePresetService],
  providers: [AcpRoleService, AcpRolePresetService],
  controllers: [],
})
export class AcpRoleModule {}

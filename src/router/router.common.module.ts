import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
// Modules
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { AcpRoleModule } from '@acp/role/acp-role.module';
import { AcpAbilityModule } from '@acp/ability/acp-ability.module';
import { AcpPolicyModule } from '@acp/policy/acp-policy.module';
import { AcpSubjectModule } from '@acp/subject/acp-subject.module';
import { HealthModule } from '@/health/health.module';
//
import { AuthCommonController } from '@/auth';
import { HealthController } from '@/health';

@Module({
  controllers: [AuthCommonController, HealthController],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    AuthModule,
    AcpRoleModule,
    AcpPolicyModule,
    AcpSubjectModule,
    AcpAbilityModule,
    TerminusModule,
    HttpModule,
    HealthModule,
  ],
})
export class RouterCommonModule {}

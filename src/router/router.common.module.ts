import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthCommonController, AuthModule } from '@/auth';
import { HealthModule, HealthController } from '@/health';
import { UserModule } from '@/user';
import { AcpRoleModule } from '@acp/role';
import { AcpPolicyModule } from '@acp/policy';
import { AcpSubjectModule } from '@acp/subject';
import { AcpAbilityModule } from '@acp/ability';

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

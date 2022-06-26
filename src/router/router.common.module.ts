import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
// Modules
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';
import { HealthModule } from '@/health/health.module';
// Controllers
import { AuthCommonController } from '@/auth/controller';
import { HealthController } from '@/health/controller';

@Module({
  controllers: [AuthCommonController, HealthController],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    AuthModule,
    AclRoleModule,
    AclPolicyModule,
    AclSubjectModule,
    AclAbilityModule,
    TerminusModule,
    HttpModule,
    HealthModule,
  ],
})
export class RouterCommonModule {}

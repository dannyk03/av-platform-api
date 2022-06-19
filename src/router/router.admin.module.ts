import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UserModule, UserAdminController, UserPublicController } from '@/user';
import { AcpRoleModule } from '@acp/role';
import { AcpPolicyModule } from '@acp/policy';
import { AcpSubjectModule } from '@acp/subject';
import { AcpAbilityModule } from '@acp/ability';
import { AwsModule } from '@/aws';

@Module({
  controllers: [
    // TODO add role and permissions controllers
    UserAdminController,
    UserPublicController,
  ],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    AcpRoleModule,
    AcpPolicyModule,
    AcpSubjectModule,
    AcpAbilityModule,
    UserModule,
    AwsModule,
  ],
})
export class RouterAdminModule {}

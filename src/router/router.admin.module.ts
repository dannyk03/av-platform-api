import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UserModule, UserAdminController } from '@/user';
import { AcpRoleModule } from '@acp/role';
import { AcpPolicyModule } from '@acp/policy';
import { AcpSubjectModule } from '@acp/subject';
import { AcpAbilityModule } from '@acp/ability';
import { AwsModule } from '@/aws';
import {
  OrganizationAdminController,
  OrganizationModule,
} from '@/organization';
import { AuthService } from '@/auth';

@Module({
  controllers: [UserAdminController, OrganizationAdminController],
  providers: [AuthService],
  exports: [],
  imports: [
    AuthModule,
    AcpRoleModule,
    AcpPolicyModule,
    AcpSubjectModule,
    AcpAbilityModule,
    UserModule,
    OrganizationModule,
  ],
})
export class RouterAdminModule {}

import { AcpAbilityModule } from '@acp/ability';
import { AcpPolicyModule } from '@acp/policy';
import { AcpRoleModule } from '@acp/role';
import { AcpSubjectModule } from '@acp/subject';
import { AuthModule } from '@/auth/auth.module';
import { OrganizationModule } from '@/organization';
import { UserModule } from '@/user';
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { CoreModule } from '@/core/core.module';
import { SystemSeed } from './system.seed';

@Module({
  imports: [
    CoreModule,
    CommandModule,
    AuthModule,
    OrganizationModule,
    UserModule,
    AcpRoleModule,
    AcpPolicyModule,
    AcpSubjectModule,
    AcpAbilityModule,
  ],
  providers: [SystemSeed],
  exports: [],
})
export class SeedsModule {}

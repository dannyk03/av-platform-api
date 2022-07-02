import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
// Modules
import { HealthModule } from '@/health/health.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { OrganizationModule } from '@/organization/organization.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
// Controllers
import { AuthCommonController } from '@/auth/controller';
import { HealthController } from '@/health/controller';
import {
  OrganizationController,
  OrganizationInviteController,
} from '@/organization/controller';

@Module({
  controllers: [
    HealthController,
    AuthCommonController,
    OrganizationController,
    OrganizationInviteController,
  ],
  providers: [],
  exports: [],
  imports: [
    HealthModule,
    TerminusModule,
    AuthModule,
    UserModule,
    HttpModule,
    AuthModule,
    UserModule,
    AclRoleModule,
    OrganizationModule,
    MessagingModule,
  ],
})
export class RouterCommonModule {}

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
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { GiftModule } from '@/gifting/gift/gift.module';
// Controllers
import { AuthCommonController } from '@/auth/controller';
import { HealthController } from '@/health/controller';
import { AclRoleController } from '@acl/role/controller';
import {
  OrganizationController,
  OrganizationInviteController,
} from '@/organization/controller';
import { AclController } from '@acl/controller';
import { MagicLinkController } from '@/magic-link/controller';
//
@Module({
  controllers: [
    HealthController,
    AuthCommonController,
    OrganizationController,
    OrganizationInviteController,
    AclController,
    AclRoleController,
    MagicLinkController,
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
    AclPolicyModule,
    OrganizationModule,
    MessagingModule,
    GiftModule,
  ],
})
export class RouterCommonModule {}

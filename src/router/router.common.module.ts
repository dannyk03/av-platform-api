import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AclController } from '@acl/controller';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
import { AclRoleController } from '@acl/role/controller';

import { AuthModule } from '@/auth/auth.module';
import { AuthCommonController } from '@/auth/controller';
import { GiftModule } from '@/gifting/gift/gift.module';
import { HealthController } from '@/health/controller';
import { HealthModule } from '@/health/health.module';
import { MagicLinkController } from '@/magic-link/controller';
import { MessagingModule } from '@/messaging/messaging.module';
import {
  OrganizationController,
  OrganizationInviteController,
} from '@/organization/controller';
import { OrganizationModule } from '@/organization/organization.module';
import { UserController } from '@/user/controller';
import { UserModule } from '@/user/user.module';

@Module({
  controllers: [
    HealthController,
    AuthCommonController,
    UserController,
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

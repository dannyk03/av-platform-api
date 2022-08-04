import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AclController } from '@acl/controller';
import { AclRoleController } from '@acl/role/controller';

import { AuthModule } from '@/auth/auth.module';
import { GiftModule } from '@/gifting/gift/gift.module';
import { HealthModule } from '@/health/health.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { OrganizationModule } from '@/organization/organization.module';
import { PaymentModule } from '@/payment/payment.module';
import { UserModule } from '@/user/user.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { AuthCommonController } from '@/auth/controller';
import { HealthController } from '@/health/controller';
import { MagicLinkController } from '@/magic-link/controller';
import {
  OrganizationController,
  OrganizationInviteController,
} from '@/organization/controller';
import { PaymentController } from '@/payment/controller';
import { UserController } from '@/user/controller';

@Module({
  controllers: [
    HealthController,
    AuthCommonController,
    UserController,
    OrganizationController,
    OrganizationInviteController,
    PaymentController,
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
    PaymentModule,
    MessagingModule,
    GiftModule,
  ],
})
export class RouterCommonModule {}

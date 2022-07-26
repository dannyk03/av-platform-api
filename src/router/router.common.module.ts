import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
// Modules
import { AuthModule } from '$/auth/auth.module';
import { GiftModule } from '$/gifting/gift/gift.module';
import { HealthModule } from '$/health/health.module';
import { MessagingModule } from '$/messaging/messaging.module';
import { OrganizationModule } from '$/organization/organization.module';
import { UserModule } from '$/user/user.module';
import { AclPolicyModule } from '$acl/policy/acl-policy.module';
import { AclRoleModule } from '$acl/role/acl-role.module';
// Controllers
import { AuthCommonController } from '$/auth/controller';
import { HealthController } from '$/health/controller';
import { MagicLinkController } from '$/magic-link/controller';
import {
  OrganizationController,
  OrganizationInviteController,
} from '$/organization/controller';
import { UserController } from '$/user/controller';
import { AclController } from '$acl/controller';
import { AclRoleController } from '$acl/role/controller';
//
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

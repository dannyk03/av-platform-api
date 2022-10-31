import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AclController } from '@acl/controller';
import { AclRoleController } from '@acl/role/controller';

import { AuthModule } from '@/auth/auth.module';
import { GiftModule } from '@/gifting/gift.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { NetworkingModule } from '@/networking/networking.module';
import { OrganizationModule } from '@/organization/organization.module';
import { UserModule } from '@/user/user.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclRoleModule } from '@acl/role/acl-role.module';

import { AuthCommonController } from '@/auth/controller';
import { MagicLinkController } from '@/magic-link/controller';
import {
  OrganizationController,
  OrganizationInviteController,
} from '@/organization/controller';

@Module({
  controllers: [
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
    NetworkingModule,
  ],
})
export class RouterCommonModule {}

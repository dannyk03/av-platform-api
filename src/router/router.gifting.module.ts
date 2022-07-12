import { Module } from '@nestjs/common';
// Modules
import { AuthModule } from '@/auth/auth.module';
import { AclRoleModule } from '@acl/role/acl-role.module';
import { AclPolicyModule } from '@acl/policy/acl-policy.module';
import { AclSubjectModule } from '@acl/subject/acl-subject.module';
import { AclAbilityModule } from '@acl/ability/acl-ability.module';
import { OrganizationModule } from '@/organization/organization.module';
import { UserModule } from '@/user/user.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { GiftModule } from '@/gifting/gift/gift.module';
// Controllers
import { GiftController } from '@/gifting/gift/controller/gift-common.controller';
//

@Module({
  controllers: [GiftController],
  providers: [],
  exports: [],
  imports: [
    GiftModule,
    MessagingModule,
    // AuthModule,
    AclRoleModule,
    // AclPolicyModule,
    // AclSubjectModule,
    // AclAbilityModule,
    UserModule,
    // OrganizationModule,
  ],
})
export class RouterGiftingModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { Organization } from './entity/organization.entity';
import { OrganizationInvite } from './entity/organization-invite.entity';
// Services
import { OrganizationService } from './service/organization.service';
import { OrganizationInviteService } from './service/organization-invite.service';
import { EmailService } from '@/messaging/service/email/email.service';
//
import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Organization, OrganizationInvite],
      ConnectionNames.Default,
    ),
  ],
  exports: [OrganizationService, OrganizationInviteService],
  providers: [OrganizationService, OrganizationInviteService, EmailService],
  controllers: [],
})
export class OrganizationModule {}

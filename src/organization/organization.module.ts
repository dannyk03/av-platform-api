import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { Organization, OrganizationInvite } from './entity';
// Services
import { EmailService } from '@/messaging/service/email';
import { OrganizationService, OrganizationInviteService } from './service';
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

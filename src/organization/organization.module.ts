import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { Organization, OrganizationInviteLink } from './entity';
// Services
// import { EmailService } from '@/messaging/email';
import { OrganizationService, OrganizationInviteService } from './service';
//
import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Organization, OrganizationInviteLink],
      ConnectionNames.Default,
    ),
  ],
  exports: [OrganizationService, OrganizationInviteService],
  providers: [OrganizationService, OrganizationInviteService],
  controllers: [],
})
export class OrganizationModule {}

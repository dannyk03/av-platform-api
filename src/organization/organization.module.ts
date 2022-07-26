import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Modules
import { MessagingModule } from '$/messaging/messaging.module';
// Entities
import { Organization, OrganizationInviteLink } from './entity';
// Services
import { OrganizationInviteService, OrganizationService } from './service';
//
import { ConnectionNames } from '$/database';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Organization, OrganizationInviteLink],
      ConnectionNames.Default,
    ),
    MessagingModule,
  ],
  exports: [OrganizationService, OrganizationInviteService],
  providers: [OrganizationService, OrganizationInviteService],
  controllers: [],
})
export class OrganizationModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionNames } from '@/database';
import { MessagingModule } from '@/messaging/messaging.module';

import { Organization, OrganizationInviteLink } from './entity';
import { OrganizationInviteService, OrganizationService } from './service';

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

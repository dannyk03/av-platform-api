import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import {
  Group,
  GroupInviteLink,
  GroupInviteMemberLink,
  GroupMember,
} from './entity';

import {
  GroupInviteLinkService,
  GroupInviteMemberService,
  GroupMemberService,
  GroupService,
} from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Group, GroupMember, GroupInviteMemberLink, GroupInviteLink],
      ConnectionNames.Default,
    ),
    UserModule,
    NetworkingModule,
  ],
  exports: [
    GroupService,
    GroupMemberService,
    GroupInviteMemberService,
    GroupInviteLinkService,
  ],
  providers: [
    GroupService,
    GroupMemberService,
    GroupInviteMemberService,
    GroupInviteLinkService,
  ],
  controllers: [],
})
export class GroupModule {}

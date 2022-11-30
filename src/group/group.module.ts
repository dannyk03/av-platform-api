import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import { Group, GroupInviteMember, GroupMember } from './entity';

import {
  GroupInviteMemberService,
  GroupMemberService,
  GroupService,
} from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Group, GroupMember, GroupInviteMember],
      ConnectionNames.Default,
    ),
    UserModule,
    NetworkingModule,
  ],
  exports: [GroupService, GroupMemberService, GroupInviteMemberService],
  providers: [GroupService, GroupMemberService, GroupInviteMemberService],
  controllers: [],
})
export class GroupModule {}

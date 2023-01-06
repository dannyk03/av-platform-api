import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import {
  Group,
  GroupInviteLink,
  GroupInviteMemberLink,
  GroupMember,
  GroupQuestion,
} from './entity';
import { GroupQuestionAnswer } from '@/group/entity/group-question-answer.entity';

import {
  GroupInviteLinkService,
  GroupInviteMemberLinkService,
  GroupMemberService,
  GroupQuestionService,
  GroupService,
} from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Group,
        GroupMember,
        GroupInviteMemberLink,
        GroupInviteLink,
        GroupQuestion,
        GroupQuestionAnswer,
      ],
      ConnectionNames.Default,
    ),
    UserModule,
    NetworkingModule,
  ],
  exports: [
    GroupService,
    GroupMemberService,
    GroupInviteMemberLinkService,
    GroupInviteLinkService,
    GroupQuestionService,
  ],
  providers: [
    GroupService,
    GroupMemberService,
    GroupInviteMemberLinkService,
    GroupInviteLinkService,
    GroupQuestionService,
  ],
  controllers: [],
})
export class GroupModule {}

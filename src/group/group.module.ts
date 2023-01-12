import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsModule } from '@/jobs/jobs.module';
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
  GroupQuestionAnswerService,
  GroupQuestionService,
  GroupService,
} from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    JobsModule.register(),
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
    GroupQuestionAnswerService,
  ],
  providers: [
    GroupService,
    GroupMemberService,
    GroupInviteMemberLinkService,
    GroupInviteLinkService,
    GroupQuestionService,
    GroupQuestionAnswerService,
  ],
  controllers: [],
})
export class GroupModule {}

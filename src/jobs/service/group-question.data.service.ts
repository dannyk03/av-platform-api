import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { DataSource, Equal, Not, Repository } from 'typeorm';

import { GroupMember, GroupQuestion } from '@/group/entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupQuestionDataService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    @InjectRepository(GroupMember, ConnectionNames.Default)
    private readonly groupMemberRepository: Repository<GroupMember>,
  ) {}

  getGroupMembersToSendGroupQuestion(groupQuestion: GroupQuestion) {
    return this.groupMemberRepository.find({
      where: {
        group: {
          id: groupQuestion.group.id,
        },
        user: {
          id: Not(Equal(groupQuestion.createdBy.id)),
        },
      },
      relations: ['user', 'user.profile'],
    });
  }
}

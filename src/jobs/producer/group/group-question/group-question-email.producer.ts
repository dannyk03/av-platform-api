import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';
import { Equal, Not } from 'typeorm';

import { GroupQuestion } from '@/group/entity';

import { GroupMemberService } from '@/group/service/group-member.service';

import { EnumGroupJobsName } from '@/jobs/constant';
import { EnumJobsQueue } from '@/queue/constant';

@Injectable()
export class GroupQuestionEmailProducer {
  constructor(
    @InjectQueue(EnumJobsQueue.GroupQuestionCreated)
    private readonly groupQuestionQueue: Queue,
    private readonly groupMemberService: GroupMemberService,
  ) {}

  async groupCreatedEmail(groupQuestion: GroupQuestion) {
    try {
      const members = await this.groupMemberService.find({
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

      await this.groupQuestionQueue.addBulk(
        members.map((member) => ({
          name: EnumGroupJobsName.GroupQuestionCreated,
          data: {
            member,
            groupQuestion,
          },
        })),
      );
    } catch (e) {
      console.log(e);
    }
  }
}

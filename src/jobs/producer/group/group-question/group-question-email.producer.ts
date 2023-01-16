import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { GroupQuestion } from '@/group/entity';

import { GroupQuestionDataService } from '@/jobs/service';

import { EnumGroupJobsName } from '@/jobs/constant';
import { EnumJobsQueue } from '@/queue/constant';

@Injectable()
export class GroupQuestionEmailProducer {
  constructor(
    @InjectQueue(EnumJobsQueue.GroupQuestionCreated)
    private readonly groupQuestionQueue: Queue,
    private readonly groupMemberService: GroupQuestionDataService,
  ) {}

  async groupCreatedEmail(groupQuestion: GroupQuestion) {
    try {
      const members =
        await this.groupMemberService.getGroupMembersToSendGroupQuestion(
          groupQuestion,
        );

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

import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';

import { ProactiveEmailService } from '@/jobs/service';

import { GroupQuestionCreateJobPayload } from '@/group/type';

import { EnumGroupJobsName } from '@/jobs/constant';
import { EnumJobsQueue } from '@/queue/constant';

@Processor({
  name: EnumJobsQueue.GroupQuestionCreated,
})
export class GroupQuestionEmailProcessor extends WorkerHost {
  constructor(private readonly proactiveEmailService: ProactiveEmailService) {
    super();
  }
  process(
    job: Job<GroupQuestionCreateJobPayload, any, EnumGroupJobsName>,
  ): Promise<any> {
    return this.proactiveEmailService.sendGroupQuestionCreatedEmail(job.data);
  }
}

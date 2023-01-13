import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';

import { ProactiveEmailService } from '../service';

import { EnumJobsCronName } from '../constant';
import { EnumJobsQueue } from '@/queue/constant';

@Processor({
  name: EnumJobsQueue.ProactiveEmail,
})
export class ProactiveEmailProcessor extends WorkerHost {
  constructor(private readonly proactiveEmailService: ProactiveEmailService) {
    super();
  }

  process(job: Job<any, any, EnumJobsCronName>): Promise<boolean> {
    return this.proactiveEmailService.sendUpcomingMilestoneReminderEmail(
      Object.assign({}, job.data, { notificationType: job.name }),
    );
  }
}

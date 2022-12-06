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

  process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case EnumJobsCronName.NextWeekBirthday:
        // return this.proactiveEmailService.sendBirthdayNotification(job.data);
        return Promise.resolve();

      default:
        break;
    }
  }
}

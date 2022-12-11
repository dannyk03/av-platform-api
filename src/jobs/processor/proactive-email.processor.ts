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

  // TODO [A20-205] here is the queue processor (Consider whether we should use the same function, depends on the email template)
  process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case EnumJobsCronName.NextWeekBirthday:
        return this.proactiveEmailService.sendBirthdayReminderEmail(job.data);

      case EnumJobsCronName.NextDayBirthday:
        return this.proactiveEmailService.sendBirthdayReminderEmail(job.data);

      default:
        break;
    }
  }
}

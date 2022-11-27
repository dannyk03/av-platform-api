import { Process, Processor } from '@nestjs/bull';

import { Job } from 'bull';

import { EmailService } from '@/messaging/email/service';

import { EnumJobsCronName } from '../constant';
import { EnumJobsQueue } from '@/queue/constant';

@Processor(EnumJobsQueue.Email)
export class EmailBirthdayNotificationJobConsumer {
  constructor(private readonly emailService: EmailService) {}

  @Process(EnumJobsCronName.NextWeekBirthday)
  async sendBirthdayNotification(job: Job<unknown>) {
    console.log('xxx');
    // const xxx = await job.moveToFailed({ message: 'aaaaaaxxxx' });
    console.log('xxx');
  }
}

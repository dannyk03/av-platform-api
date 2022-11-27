import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';

import { Job } from 'bullmq';

import { EmailService } from '@/messaging/email/service';

import { EnumJobsQueue } from '@/queue/constant';

@Processor(EnumJobsQueue.Email)
export class EmailBirthdayNotificationJobProcessor extends WorkerHost {
  constructor(@Inject('EmailService') appService: EmailService) {
    super();
  }

  process(job: Job<any, any, string>, token?: string): Promise<any> {
    return Promise.resolve();
  }
}

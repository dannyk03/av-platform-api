import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UserProfileService } from '@/user/service';

import { EnumJobsCronName } from '../constant';

// import { EnumJobsQueue } from '@/queue/constant';
// import { Queue } from 'bullmq';
// import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ProactiveEmailProducer {
  constructor(
    // @InjectQueue(EnumJobsQueue.ProactiveEmail)
    // private readonly proactiveEmailQueue: Queue,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextWeekBirthdayProactiveNotification() {
    console.log('first');
  }
}

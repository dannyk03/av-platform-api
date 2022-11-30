import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Queue } from 'bullmq';

import { UserProfileService } from '@/user/service';

import { EnumJobsCronName } from '../constant';
import { EnumJobsQueue } from '@/queue/constant';

@Injectable()
export class ProactiveEmailProducer {
  constructor(
    @InjectQueue(EnumJobsQueue.ProactiveEmail)
    private readonly proactiveEmailQueue: Queue,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextWeekBirthdayProactiveNotification() {
    try {
      await this.proactiveEmailQueue.add(EnumJobsCronName.NextWeekBirthday, {
        foo: 'bar',
      });
    } catch (error) {
      console.log(error);
    }
  }
}

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Queue } from 'bull';

import { UserProfileService } from '@/user/service';

import { EnumJobsCronName } from '../constant';
import { EnumJobsQueue } from '@/queue/constant';

@Injectable()
export class CronEmailJobProducer {
  constructor(
    @InjectQueue(EnumJobsQueue.Email)
    private readonly emailQueue: Queue,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextWeekBirthdayProactiveNotification() {
    try {
      await this.emailQueue.add(EnumJobsCronName.NextWeekBirthday, {
        foo: 'bar',
      });
    } catch (error) {
      console.log(error);
    }
  }
}

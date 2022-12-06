import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ProactiveEmailService } from '../service';

import { EnumJobsCronName } from '../constant';

// import { EnumJobsQueue } from '@/queue/constant';
// import { Queue } from 'bullmq';
// import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ProactiveEmailProducer {
  constructor(
    // @InjectQueue(EnumJobsQueue.ProactiveEmail)
    // private readonly proactiveEmailQueue: Queue,
    private readonly proactiveEmailService: ProactiveEmailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextWeekBirthdayProactiveNotification() {
    const data = await this.proactiveEmailService.getBirthdayInXDaysConnections(
      7,
    );

    console.log(data);
  }
}

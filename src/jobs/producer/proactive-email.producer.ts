import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { EnumGroupUpcomingMilestoneType } from '@avo/type';

import { Queue } from 'bullmq';

import { ProactiveEmailDataService } from '../service';

import { EnumJobsCronName } from '../constant';
import { EnumJobsQueue } from '@/queue/constant';

@Injectable()
export class ProactiveEmailProducer {
  constructor(
    // TODO [A20-205] here is the queue
    @InjectQueue(EnumJobsQueue.ProactiveEmail)
    private readonly proactiveEmailQueue: Queue,
    private readonly proactiveEmailDataService: ProactiveEmailDataService,
  ) {}

  // TODO [A20-205] change to CronExpression.EVERY_DAY_AT_1PM
  @Cron(CronExpression.EVERY_MINUTE, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextWeekBirthdayProactiveNotification() {
    const inDays = 7;
    try {
      const data = await this.proactiveEmailDataService.getMilestoneInXDaysData(
        inDays,
        EnumGroupUpcomingMilestoneType.Birthday,
      );

      data.forEach(async (birthDayData) =>
        // TODO [A20-205] here is the data producer for the queue
        this.proactiveEmailQueue.add(
          EnumJobsCronName.NextWeekBirthday,
          birthDayData,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  // TODO [A20-205] change to CronExpression.EVERY_DAY_AT_1PM
  @Cron(CronExpression.EVERY_MINUTE, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextDayBirthdayProactiveNotification() {
    const inDays = 1;
    try {
      const data = await this.proactiveEmailDataService.getMilestoneInXDaysData(
        inDays,
        EnumGroupUpcomingMilestoneType.Birthday,
      );

      data.forEach(async (birthDayData) =>
        // TODO [A20-205] here is the data producer for the queue
        this.proactiveEmailQueue.add(
          EnumJobsCronName.NextDayBirthday,
          birthDayData,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }
}

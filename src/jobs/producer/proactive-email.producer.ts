import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { EnumGroupUpcomingMilestoneType } from '@avo/type';

import { Queue } from 'bullmq';

import { ProactiveEmailService } from '../service';

import { EnumJobsCronName } from '../constant';
import { EnumJobsQueue } from '@/queue/constant';

@Injectable()
export class ProactiveEmailProducer {
  constructor(
    @InjectQueue(EnumJobsQueue.ProactiveEmail)
    private readonly proactiveEmailQueue: Queue,
    private readonly proactiveEmailService: ProactiveEmailService,
  ) {}

  // TODO change to CronExpression.EVERY_DAY_AT_1PM
  @Cron(CronExpression.EVERY_MINUTE, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextWeekBirthdayProactiveNotification() {
    try {
      const data = await this.proactiveEmailService.getMilestoneInXDaysData(
        7,
        EnumGroupUpcomingMilestoneType.Birthday,
      );

      data.forEach(async (birthDayData) =>
        this.proactiveEmailQueue.add(
          EnumJobsCronName.NextWeekBirthday,
          birthDayData,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  // TODO change to CronExpression.EVERY_DAY_AT_1PM
  @Cron(CronExpression.EVERY_MINUTE, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextDayBirthdayProactiveNotification() {
    try {
      const data = await this.proactiveEmailService.getMilestoneInXDaysData(
        1,
        EnumGroupUpcomingMilestoneType.Birthday,
      );

      data.forEach(async (birthDayData) =>
        this.proactiveEmailQueue.add(
          EnumJobsCronName.NextWeekBirthday,
          birthDayData,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }
}

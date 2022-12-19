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
    @InjectQueue(EnumJobsQueue.ProactiveEmail)
    private readonly proactiveEmailQueue: Queue,
    private readonly proactiveEmailDataService: ProactiveEmailDataService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextWeekBirthdayProactiveNotification() {
    const inDays = 7;
    try {
      const data = await this.proactiveEmailDataService.getMilestoneInXDaysData(
        inDays,
        EnumGroupUpcomingMilestoneType.Birthday,
      );

      await this.proactiveEmailQueue.addBulk(
        data.map((birthDayData) => ({
          name: EnumJobsCronName.NextWeekBirthday,
          data: birthDayData,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.NextDayBirthday,
  })
  async handleNextDayBirthdayProactiveNotification() {
    const inDays = 1;
    try {
      const data = await this.proactiveEmailDataService.getMilestoneInXDaysData(
        inDays,
        EnumGroupUpcomingMilestoneType.Birthday,
      );

      await this.proactiveEmailQueue.addBulk(
        data.map((birthDayData) => ({
          name: EnumJobsCronName.NextDayBirthday,
          data: birthDayData,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.NextWeekWorkAnniversary,
  })
  async handleNextWeekWorkAnniversaryProactiveNotification() {
    const inDays = 7;
    try {
      const data = await this.proactiveEmailDataService.getMilestoneInXDaysData(
        inDays,
        EnumGroupUpcomingMilestoneType.WorkAnniversary,
      );

      await this.proactiveEmailQueue.addBulk(
        data.map((workAnniversaryData) => ({
          name: EnumJobsCronName.NextWeekWorkAnniversary,
          data: workAnniversaryData,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.NextDayWorkAnniversary,
  })
  async handleNextDayWorkAnniversaryProactiveNotification() {
    const inDays = 1;
    try {
      const data = await this.proactiveEmailDataService.getMilestoneInXDaysData(
        inDays,
        EnumGroupUpcomingMilestoneType.WorkAnniversary,
      );

      await this.proactiveEmailQueue.addBulk(
        data.map((workAnniversaryData) => ({
          name: EnumJobsCronName.NextDayWorkAnniversary,
          data: workAnniversaryData,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }
}

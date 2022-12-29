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

  private async addUpcomingMilestoneJob(
    type: EnumGroupUpcomingMilestoneType,
    jobName: EnumJobsCronName,
    inDays: number,
  ) {
    try {
      const data = await this.proactiveEmailDataService.getMilestoneInXDaysData(
        inDays,
        type,
      );

      await this.proactiveEmailQueue.addBulk(
        data.map((jobData) => ({
          name: jobName,
          data: jobData,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.NextWeekBirthday,
  })
  async handleNextWeekBirthdayProactiveNotification() {
    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.Birthday,
      EnumJobsCronName.NextWeekBirthday,
      7,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.NextDayBirthday,
  })
  async handleNextDayBirthdayProactiveNotification() {
    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.Birthday,
      EnumJobsCronName.NextDayBirthday,
      1,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.NextWeekWorkAnniversary,
  })
  async handleNextWeekWorkAnniversaryProactiveNotification() {
    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.WorkAnniversary,
      EnumJobsCronName.NextWeekWorkAnniversary,
      7,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.NextDayWorkAnniversary,
  })
  async handleNextDayWorkAnniversaryProactiveNotification() {
    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.WorkAnniversary,
      EnumJobsCronName.NextDayWorkAnniversary,
      1,
    );
  }
}

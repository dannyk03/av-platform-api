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
        data.map((jobData: any) => ({
          name: jobName,
          data: jobData,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, {
    name: EnumJobsCronName.Notification10DaysBeforeBirthday,
  })
  async handle10DaysBeforeBirthdayProactiveNotification() {
    const inDays = 10;

    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.Birthday,
      EnumJobsCronName.Notification10DaysBeforeBirthday,
      inDays,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, {
    name: EnumJobsCronName.NotificationTodayBirthday,
  })
  async handleTodayBirthdayProactiveNotification() {
    const inDays = 0;

    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.Birthday,
      EnumJobsCronName.NotificationTodayBirthday,
      inDays,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, {
    name: EnumJobsCronName.Notification10DaysBeforeWorkAnniversary,
  })
  async handle10DaysBeforeWorkAnniversaryProactiveNotification() {
    const inDays = 10;

    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.WorkAnniversary,
      EnumJobsCronName.Notification10DaysBeforeWorkAnniversary,
      inDays,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, {
    name: EnumJobsCronName.NotificationTodayWorkAnniversary,
  })
  async handleTodayWorkAnniversaryProactiveNotification() {
    const inDays = 0;

    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.WorkAnniversary,
      EnumJobsCronName.NotificationTodayWorkAnniversary,
      inDays,
    );
  }
}

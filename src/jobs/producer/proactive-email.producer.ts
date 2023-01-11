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

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.Cron10DaysBeforeBirthday,
  })
  async handle10DaysBeforeBirthdayProactiveNotification() {
    const inDays = 10;

    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.Birthday,
      EnumJobsCronName.Cron10DaysBeforeBirthday,
      inDays,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: EnumJobsCronName.Cron1DayBeforeBirthday,
  })
  async handle1DayBeforeBirthdayProactiveNotification() {
    const inDays = 1;

    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.Birthday,
      EnumJobsCronName.Cron1DayBeforeBirthday,
      inDays,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM, {
    name: EnumJobsCronName.Cron10DaysBeforeWorkAnniversary,
  })
  async handle10DaysBeforeWorkAnniversaryProactiveNotification() {
    const inDays = 10;

    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.WorkAnniversary,
      EnumJobsCronName.Cron10DaysBeforeWorkAnniversary,
      inDays,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, {
    name: EnumJobsCronName.Cron1DayBeforeWorkAnniversary,
  })
  async handle1DayBeforeWorkAnniversaryProactiveNotification() {
    const inDays = 1;

    await this.addUpcomingMilestoneJob(
      EnumGroupUpcomingMilestoneType.WorkAnniversary,
      EnumJobsCronName.Cron1DayBeforeWorkAnniversary,
      inDays,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { EnumGroupUpcomingMilestoneType } from '@avo/type';

import { DataSource } from 'typeorm';

import { ConnectionNames } from '@/database/constant';

const columnsMap = {
  [EnumGroupUpcomingMilestoneType.WorkAnniversary]: {
    day: 'work_anniversary_day',
    month: 'work_anniversary_month',
  },
  [EnumGroupUpcomingMilestoneType.Birthday]: {
    day: 'birth_day',
    month: 'birth_month',
  },
};

@Injectable()
export class ProactiveEmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendBirthdayReminderEmail(data) {
    // TODO [A20-205]  Create type form input data (Better by using class-transformer)
    // TODO [A20-205] Create email template in customer.io and send payload like in regular EmailService
  }
}

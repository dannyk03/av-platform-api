import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProactiveEmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendBirthdayReminderEmail(data) {
    // TODO [A20-205]  Create type form input data (Better by using class-transformer)
    // TODO [A20-205] Create email template in customer.io and send payload like in regular EmailService
  }
}

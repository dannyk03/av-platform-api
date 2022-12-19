import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { plainToInstance } from 'class-transformer';

import { CustomerIOService } from '@/messaging/customer-io/service';

import { SendEmailDto } from '@/messaging/email/dto';

import { EmailStatus, EmailTemplate } from '@/messaging/email/constant';

import { UpcomingMileStoneNotificationDto } from '@/jobs/producer/transform';

@Injectable()
export class ProactiveEmailService {
  private readonly isDevelopment =
    this.configService.get<boolean>('app.isDevelopment');
  private readonly isStaging = this.configService.get<boolean>('app.isStaging');

  constructor(
    private readonly configService: ConfigService,
    private readonly customerIOService: CustomerIOService,
  ) {}

  private get origin(): string {
    if (this.isDevelopment) {
      return 'http://localhost:3000';
    }

    if (this.isStaging) {
      return 'https://staging--avo-gifting.netlify.app';
    }

    return `https://gifting.avonow.com`;
  }

  private sendEmail(data: SendEmailDto) {
    if (this.isDevelopment) {
      return;
    }

    return this.customerIOService.sendEmail(data);
  }

  async sendUpcomingMilestoneReminderEmail(data): Promise<boolean> {
    const payload = plainToInstance(UpcomingMileStoneNotificationDto, data);

    const sendResult = await this.sendEmail({
      template: EmailTemplate.SendUpcomingMilestoneNotification.toString(),
      to: [payload.recipient.email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: payload.recipient.email },
    });

    return sendResult?.status === EmailStatus.success;
  }
}

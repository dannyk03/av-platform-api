import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CustomerIOService } from '@/messaging/customer-io/service';

@Injectable()
export class ProactiveEmailService {
  private readonly isDevelopment: boolean =
    this.configService.get<boolean>('app.isDevelopment');

  constructor(
    private readonly configService: ConfigService,
    private readonly customerIOService: CustomerIOService,
  ) {}

  async sendBirthdayNotification(data) {
    console.log(data);
  }
}

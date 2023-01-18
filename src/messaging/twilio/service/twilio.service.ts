import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import TwilioClient from 'twilio/lib/rest/Twilio';

import { InjectTwilioClient } from '../decorator';

import { EnumTwilioVerificationCheckStatus } from '../constant';

@Injectable()
export class TwilioService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @InjectTwilioClient()
    private readonly twilioClient: TwilioClient,
  ) {}

  onModuleInit() {
    const isMigration = this.configService.get<boolean>('app.isMigration');
    if (!(this.twilioClient || isMigration)) {
      // Only during the migrations phase (CI/CD), it can be uninitialized, any other case is a development error.
      throw Error('Twilio client is not initialized');
    }
  }

  async createVerificationsSmsOPT({ phoneNumber }: { phoneNumber: string }) {
    const otpServiceSID = this.configService.get<string>(
      'twilio.service.verify.otp.sid',
    );

    const otpServiceChannel = this.configService.get<string>(
      'twilio.service.verify.otp.channel',
    );

    const result = await this.twilioClient.verify.v2
      .services(otpServiceSID)
      .verifications.create({
        to: phoneNumber,
        channel: otpServiceChannel,
      });

    return result;
  }

  async checkVerificationSmsOTP({
    phoneNumber,
    code,
  }: {
    phoneNumber: string;
    code: string;
  }): Promise<boolean> {
    const otpServiceSID = this.configService.get<string>(
      'twilio.service.verify.otp.sid',
    );

    const result = await this.twilioClient.verify.v2
      .services(otpServiceSID)
      .verificationChecks.create({ to: phoneNumber, code });

    return result.status === EnumTwilioVerificationCheckStatus.Approved;
  }
}

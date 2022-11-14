import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import TwilioClient from 'twilio/lib/rest/Twilio';
import { DataSource } from 'typeorm';

import { InjectTwilio } from '../decorator';

import { EnumTwilioVerificationCheckStatus } from '../constant';
import { ConnectionNames } from '@/database/constant';

@Injectable()
export class TwilioService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectTwilio()
    private readonly twilioClient: TwilioClient,
    private readonly configService: ConfigService,
  ) {}

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

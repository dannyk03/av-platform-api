import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import TwilioClient from 'twilio/lib/rest/Twilio';
import { DataSource } from 'typeorm';

import { InjectTwilio } from '../decorator';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class TwilioService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectTwilio()
    private readonly twilioClient: TwilioClient,
  ) {}

  async test() {
    console.log(this.twilioClient);
  }
}

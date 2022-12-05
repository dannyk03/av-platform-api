import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { CustomerIOService } from '@/messaging/customer-io/service';
import { UserService } from '@/user/service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class ProactiveEmailService {
  private readonly isProduction: boolean =
    this.configService.get<boolean>('app.isProduction');

  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async getBirthdayInXDaysEmailData(inDays: number) {
    return this.defaultDataSource.query(
      `

    `,
    );
  }
}

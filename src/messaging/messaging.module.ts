import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TwilioModule } from '@/messaging/twilio/twilio.module';

import { EmailService } from './email/service';
import { TwilioService } from './twilio/service';

import { CustomerIOService } from './customer-io';

@Module({
  imports: [
    HttpModule,
    TwilioModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('twilio.apiKey'),
        apiSecretKey: configService.get<string>('twilio.apiSecretKey'),
        accountSid: configService.get<string>('twilio.accountSid'),
        logLevel: configService.get<string>('twilio.logLevel'),
      }),
    }),
  ],
  exports: [EmailService, CustomerIOService, TwilioService],
  providers: [EmailService, CustomerIOService, TwilioService],
  controllers: [],
})
export class MessagingModule {}

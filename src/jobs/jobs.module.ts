import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { name } from 'package.json';

import { MessagingModule } from '@/messaging/messaging.module';
import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import { ProactiveEmailDataService, ProactiveEmailService } from './service';

import { EnumJobsQueue } from '@/queue/constant';

import { ProactiveEmailProcessor } from './processor';
import { ProactiveEmailProducer } from './producer';
import { JobsRouterModule } from './router';

@Module({})
export class JobsModule {
  static register(): DynamicModule {
    if (
      process.env.APP_JOB_ON === 'true' &&
      process.env.INTEGRATION_TEST !== 'true' &&
      process.env.UNIT_TEST !== 'true'
    ) {
      return {
        module: JobsModule,
        providers: [
          ProactiveEmailService,
          ProactiveEmailDataService,
          ProactiveEmailProducer,
          ProactiveEmailProcessor,
        ],
        imports: [
          UserModule,
          NetworkingModule,
          MessagingModule,
          JobsRouterModule,
          ScheduleModule.forRoot(),
          BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
              const redis = {
                host: configService.get('redis.host'),
                port: configService.get('redis.port'),
              };

              return {
                prefix: name,
                redis,
                defaultJobOptions: {
                  removeOnComplete: true,
                  attempts: 3,
                  backoff: {
                    type: 'exponential',
                    delay: 10000,
                  },
                },
              };
            },
          }),
          BullModule.registerQueueAsync({
            name: EnumJobsQueue.ProactiveEmail,
          }),
        ],
      };
    }

    return {
      module: JobsModule,
      providers: [],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}

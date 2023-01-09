import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { name } from 'package.json';

import { GroupModule } from '@/group/group.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import { ProactiveEmailDataService, ProactiveEmailService } from './service';

import { EnumJobsQueue } from '@/queue/constant';

import {
  GroupQuestionEmailProcessor,
  ProactiveEmailProcessor,
} from './processor';
import { GroupQuestionEmailProducer, ProactiveEmailProducer } from './producer';
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
          GroupQuestionEmailProducer,
          GroupQuestionEmailProcessor,
        ],
        exports: [GroupQuestionEmailProducer],
        imports: [
          UserModule,
          NetworkingModule,
          MessagingModule,
          JobsRouterModule,
          ScheduleModule.forRoot(),
          GroupModule,
          BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
              const host = configService.get('redis.host');
              const port = configService.get('redis.port');

              return {
                prefix: name,
                connection: {
                  host,
                  port,
                },
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
          BullModule.registerQueue(
            {
              name: EnumJobsQueue.ProactiveEmail,
            },
            {
              name: EnumJobsQueue.GroupQuestionCreated,
            },
          ),
        ],
        global: true,
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

import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { name } from 'package.json';

import { RedisServerModule } from '@/cache/redis/redis-server/redis-server.module';
import { MessagingModule } from '@/messaging/messaging.module';
import { UserModule } from '@/user/user.module';

import { ProactiveEmailService } from './service';
import { RedisServerService } from '@/cache/redis/redis-server/service';

import { EnumJobsQueue } from '@/queue/constant';

import { ProactiveEmailProcessor } from './processor';
import { ProactiveEmailProducer } from './producer';
import { JobsRouterModule } from './router';

@Module({})
export class JobsModule {
  static register(): DynamicModule {
    if (process.env.APP_JOB_ON === 'true') {
      return {
        module: JobsModule,
        providers: [
          ProactiveEmailService,
          ProactiveEmailProducer,
          ProactiveEmailProcessor,
        ],
        imports: [
          UserModule,
          MessagingModule,
          JobsRouterModule,
          ScheduleModule.forRoot(),
          BullModule.forRootAsync({
            imports: [ConfigModule, RedisServerModule.register()],
            inject: [ConfigService, RedisServerService],
            useFactory: async (
              configService: ConfigService,
              redisServerService: RedisServerService,
            ) => ({
              prefix: name,
              redis: {
                host:
                  (await redisServerService?.getHost()) ??
                  configService.get('redis.host'),
                port:
                  (await redisServerService?.getPort()) ??
                  configService.get('redis.port'),
              },
              defaultJobOptions: {
                removeOnComplete: true,
                attempts: 3,
                backoff: {
                  type: 'exponential',
                  delay: 10000,
                },
              },
            }),
          }),
          BullModule.registerQueue({
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

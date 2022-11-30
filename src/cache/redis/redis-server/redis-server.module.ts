import { DynamicModule, Module } from '@nestjs/common';

import { RedisServerService } from './service';

@Module({})
export class RedisServerModule {
  static register(): DynamicModule {
    if (process.env.REDIS_HOST === '0.0.0.0') {
      return {
        module: RedisServerModule,
        providers: [RedisServerService],
        exports: [RedisServerService],
      };
    }

    const redisServerProvideStub = {
      provide: RedisServerService,
      useValue: null,
    };

    return {
      module: RedisServerModule,
      providers: [redisServerProvideStub],
      exports: [redisServerProvideStub],
    };
  }
}

import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class RedisModule {
  static register(): DynamicModule {
    if (process.env.REDIS_HOST === 'localhost') {
      return {
        module: RedisModule,
        providers: [],
        imports: [],
      };
    }

    return {
      module: RedisModule,
      providers: [],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}

import { CacheModule, CacheStore, DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { redisStore } from 'cache-manager-redis-store';

import { RedisServerModule } from '@/cache/redis/redis-server/redis-server.module';

import { RedisServerService } from './redis/redis-server/service';

@Module({})
export class AppCacheModule {
  static register(): DynamicModule {
    if (process.env.REDIS_HOST === 'localhost') {
      return {
        module: AppCacheModule,
        providers: [],
        imports: [
          RedisServerModule,
          CacheModule.registerAsync({
            isGlobal: true,
            imports: [RedisServerModule],
            inject: [RedisServerService],
            useFactory: async (redisServerService: RedisServerService) => {
              const store = await redisStore({
                socket: {
                  host: await redisServerService.getHost(),
                  port: await redisServerService.getPort(),
                },
              } as any);

              return {
                store: store as unknown as CacheStore,
                ttl: 60 * 60 * 24 * 7,
              };
            },
          }),
        ],
      };
    }

    return {
      module: AppCacheModule,
      providers: [],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}

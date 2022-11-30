import { CacheModule, CacheStore, DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { redisStore } from 'cache-manager-redis-store';

import { RedisServerModule } from '@/cache/redis/redis-server/redis-server.module';

import { RedisServerService } from './redis/redis-server/service';

@Module({})
export class AppCacheModule {
  static register(): DynamicModule {
    if (!process.env.REDIS_HOST || process.env.INTEGRATION_TEST === 'true') {
      return {
        module: AppCacheModule,
        providers: [],
        exports: [],
        controllers: [],
        imports: [],
      };
    }

    if (process.env.REDIS_HOST === '0.0.0.0') {
      return {
        module: AppCacheModule,
        providers: [],
        imports: [
          CacheModule.registerAsync({
            isGlobal: true,
            imports: [RedisServerModule.register()],
            inject: [RedisServerService],
            useFactory: async (redisServerService: RedisServerService) => {
              const store = await redisStore({
                socket: {
                  host: await redisServerService?.getHost(),
                  port: await redisServerService?.getPort(),
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
      imports: [
        CacheModule.registerAsync({
          isGlobal: true,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const store = await redisStore({
              socket: {
                host: configService.get('redis.host'),
                port: configService.get('redis.port'),
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
}

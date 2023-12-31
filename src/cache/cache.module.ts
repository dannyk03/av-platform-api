import { CacheModule, CacheStore, DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { redisStore } from 'cache-manager-redis-store';

@Module({})
export class AppCacheModule {
  static register(): DynamicModule {
    if (
      process.env.APP_CACHE_ON !== 'true' ||
      process.env.INTEGRATION_TEST === 'true' ||
      process.env.UNIT_TEST === 'true'
    ) {
      return {
        module: AppCacheModule,
        providers: [],
        exports: [],
        controllers: [],
        imports: [],
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

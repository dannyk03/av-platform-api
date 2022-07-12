import { RouterTestModule } from '@/router/router.test.module';
import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RouterGiftModule } from '@/router/router.gift.module';
import { RouterCallbackModule } from '@/router/router.callback.module';
import { RouterCommonModule } from '@/router/router.common.module';
import { RouterPublicModule } from '@/router/router.public.module';

@Module({})
export class AppRouterModule {
  static register(): DynamicModule {
    if (process.env.APP_HTTP_ON === 'true') {
      return {
        module: AppRouterModule,
        controllers: [],
        providers: [],
        exports: [],
        imports: [
          RouterCommonModule,
          RouterPublicModule,
          RouterGiftModule,
          RouterCallbackModule,
          RouterTestModule,
          RouterModule.register([
            {
              path: '/',
              module: RouterCommonModule,
            },
            {
              path: '/gift',
              module: RouterGiftModule,
            },
            {
              path: '/public',
              module: RouterPublicModule,
            },
            {
              path: '/callback',
              module: RouterCallbackModule,
            },
            {
              path: '/test',
              module: RouterTestModule,
            },
          ]),
        ],
      };
    }

    return {
      module: AppRouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}

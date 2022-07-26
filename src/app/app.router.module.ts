import { RouterCallbackModule } from '$/router/router.callback.module';
import { RouterCatalogModule } from '$/router/router.catalog.module';
import { RouterCommonModule } from '$/router/router.common.module';
import { RouterGiftingModule } from '$/router/router.gifting.module';
import { RouterPublicModule } from '$/router/router.public.module';
import { RouterTestModule } from '$/router/router.test.module';
import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

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
          RouterGiftingModule,
          RouterCatalogModule,
          RouterCallbackModule,
          RouterTestModule,
          RouterModule.register([
            {
              path: '/',
              module: RouterCommonModule,
            },
            {
              path: '/gift',
              module: RouterGiftingModule,
            },
            {
              path: '/catalog',
              module: RouterCatalogModule,
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

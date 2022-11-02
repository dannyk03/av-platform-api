import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import compact from 'lodash/compact';

import { RouterAppModule } from '@/router/router.app.module';
import { RouterCallbackModule } from '@/router/router.callback.module';
import { RouterCatalogModule } from '@/router/router.catalog.module';
import { RouterCommonModule } from '@/router/router.common.module';
import { RouterGiftingModule } from '@/router/router.gifting.module';
import { RouterGiftingSystemModule } from '@/router/router.gifting.system.module';
import { RouterHealthModule } from '@/router/router.health.module';
import { RouterNetworkingModule } from '@/router/router.networking.module';
import { RouterPaymentModule } from '@/router/router.payment.module';
import { RouterProductModule } from '@/router/router.product.module';
import { RouterPublicModule } from '@/router/router.public.module';
import { RouterTestModule } from '@/router/router.test.module';
import { RouterUserModule } from '@/router/router.user.module';
import { RouterUserSystemModule } from '@/router/router.user.system.module';
import { RouterVendorModule } from '@/router/router.vendor.module';
import { RouterWebhookModule } from '@/router/router.webhook.module';

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
          RouterUserModule,
          RouterUserSystemModule,
          RouterGiftingSystemModule,
          RouterGiftingModule,
          RouterCatalogModule,
          RouterProductModule,
          RouterVendorModule,
          RouterNetworkingModule,
          RouterCallbackModule,
          RouterHealthModule,
          RouterTestModule,
          RouterPaymentModule,
          RouterAppModule,
          RouterWebhookModule,
          RouterModule.register(
            compact([
              {
                path: '/',
                module: RouterCommonModule,
              },
              {
                path: '/app',
                module: RouterAppModule,
              },
              {
                path: '/system',
                children: [
                  {
                    path: '/gift',
                    module: RouterGiftingSystemModule,
                  },
                  {
                    path: '/user',
                    module: RouterUserSystemModule,
                  },
                ],
              },

              {
                path: '/user',
                module: RouterUserModule,
              },
              {
                path: '/gift',
                module: RouterGiftingModule,
              },
              {
                path: '/network',
                module: RouterNetworkingModule,
              },
              {
                path: '/catalog',
                module: RouterCatalogModule,
                children: [
                  {
                    path: '/product',
                    module: RouterProductModule,
                  },
                  {
                    path: '/vendor',
                    module: RouterVendorModule,
                  },
                ],
              },
              {
                path: '/payment',
                module: RouterPaymentModule,
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
                path: '/webhook',
                module: RouterWebhookModule,
              },
              {
                ...(process.env.APP_ENV !== 'production'
                  ? {
                      path: '/test',
                      module: RouterTestModule,
                    }
                  : null),
              },
            ]),
          ),
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

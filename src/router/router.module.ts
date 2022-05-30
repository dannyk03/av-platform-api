import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RouterCommonModule, RouterHealthModule } from '@/router';

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
          RouterHealthModule,
          RouterModule.register([
            {
              path: '/health',
              module: RouterHealthModule,
            },
            {
              path: '/',
              module: RouterCommonModule,
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

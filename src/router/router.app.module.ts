import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import {
    RouterAdminModule,
    RouterHealthModule,
    RouterPublicModule,
    RouterCommonModule,
    RouterCallbackModule,
    RouterTestModule,
} from '@/router';

@Module({})
export class RouterAppModule {
    static register(): DynamicModule {
        if (process.env.APP_HTTP_ON === 'true') {
            return {
                module: RouterAppModule,
                controllers: [],
                providers: [],
                exports: [],
                imports: [
                    RouterCommonModule,
                    RouterHealthModule,
                    RouterPublicModule,
                    RouterAdminModule,
                    RouterCallbackModule,
                    RouterTestModule,
                    RouterModule.register([
                        {
                            path: '/health',
                            module: RouterHealthModule,
                        },
                        {
                            path: '/admin',
                            module: RouterAdminModule,
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
                        {
                            path: '/',
                            module: RouterCommonModule,
                        },
                    ]),
                ],
            };
        }

        return {
            module: RouterAppModule,
            providers: [],
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ResponseCustomHeadersInterceptor } from './interceptor/response.custom-headers.interceptor';
import { ResponseTimeoutInterceptor } from './interceptor/response.timeout.interceptor';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseCustomHeadersInterceptor,
    },
  ],
  imports: [],
})
export class ResponseModule {}

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { ErrorMetaGuard } from './guards';

import { ErrorHttpFilter } from './filter/error-http.filter';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHttpFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ErrorMetaGuard,
    },
  ],
  imports: [],
})
export class ErrorModule {}

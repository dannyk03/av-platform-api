import { Module, Scope } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ErrorHttpFilter } from './filter/error-http.filter';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHttpFilter,
      scope: Scope.REQUEST,
    },
  ],
  imports: [],
})
export class ErrorModule {}

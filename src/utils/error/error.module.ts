import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
// Services
import { ResponseMessageService } from '@/response-message/service';
//
import { ErrorHttpFilter } from './error.filter';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      inject: [ResponseMessageService],
      useFactory: (responseMessageService: ResponseMessageService) => {
        return new ErrorHttpFilter(responseMessageService);
      },
    },
  ],
  imports: [],
})
export class ErrorModule {}

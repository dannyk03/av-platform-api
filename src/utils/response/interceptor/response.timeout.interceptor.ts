import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { EnumStatusCodeError } from '@avo/type';

import ms from 'ms';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';

import {
  RESPONSE_CUSTOM_TIMEOUT_META_KEY,
  RESPONSE_CUSTOM_TIMEOUT_VALUE_META_KEY,
} from '../constant';

@Injectable()
export class ResponseTimeoutInterceptor
  implements NestInterceptor<Promise<any>>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === 'http') {
      const customTimeout = this.reflector.get<boolean>(
        RESPONSE_CUSTOM_TIMEOUT_META_KEY,
        context.getHandler(),
      );

      const defaultTimeout: number = this.configService.get<number>(
        'middleware.timeout.in',
      );
      return next.handle().pipe(
        timeout(
          customTimeout
            ? ms(
                this.reflector.get<string>(
                  RESPONSE_CUSTOM_TIMEOUT_VALUE_META_KEY,
                  context.getHandler(),
                ),
              )
            : defaultTimeout,
        ),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            throw new RequestTimeoutException({
              statusCode: EnumStatusCodeError.RequestTimeout,
              message: 'http.clientError.requestTimeOut',
            });
          }
          return throwError(() => err);
        }),
      );
    }

    return next.handle();
  }
}

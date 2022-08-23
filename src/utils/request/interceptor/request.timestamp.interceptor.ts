import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { EnumRequestStatusCodeError } from '@avo/type';

import { Observable } from 'rxjs';

import { HelperDateService, HelperNumberService } from '@/utils/helper/service';

import { IRequestApp } from '../request.interface';

import { REQUEST_EXCLUDE_TIMESTAMP_META_KEY } from '../request.constant';

@Injectable()
export class RequestTimestampInterceptor
  implements NestInterceptor<Promise<any>>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly helperDateService: HelperDateService,
    private readonly helperNumberService: HelperNumberService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === 'http') {
      const request: IRequestApp = context.switchToHttp().getRequest();
      const { headers } = request;
      const mode: string = this.configService.get<string>('app.mode');
      const xTimestamp: string = headers['x-timestamp'] as string;
      const currentTimestamp: number = this.helperDateService.timestamp();
      const excludeTimestamp = this.reflector.getAllAndOverride<boolean>(
        REQUEST_EXCLUDE_TIMESTAMP_META_KEY,
        [context.getHandler(), context.getClass()],
      );
      let ts = xTimestamp;

      if (!excludeTimestamp && mode === 'secure') {
        const toleranceTimeInMs = this.configService.get<number>(
          'middleware.timestamp.toleranceTimeInMs',
        );
        const check: boolean = this.helperDateService.check(xTimestamp);

        if (!xTimestamp || !check) {
          throw new ForbiddenException({
            statusCode: EnumRequestStatusCodeError.RequestTimestampInvalidError,
            message: 'middleware.error.timestampInvalid',
          });
        }

        if (xTimestamp.length === 13) {
          try {
            ts = Math.floor(parseInt(xTimestamp, 10) / 1000).toString();
          } catch (error) {
            throw new ForbiddenException({
              statusCode:
                EnumRequestStatusCodeError.RequestTimestampInvalidError,
              message: 'middleware.error.timestampInvalid',
            });
          }
        }

        const date = this.helperDateService.create({
          date: ts,
        });
        const toleranceMin =
          this.helperDateService.backwardInMilliseconds(toleranceTimeInMs);
        const toleranceMax =
          this.helperDateService.forwardInMilliseconds(toleranceTimeInMs);

        if (date < toleranceMin || date > toleranceMax) {
          throw new ForbiddenException({
            statusCode: EnumRequestStatusCodeError.RequestTimestampInvalidError,
            message: 'middleware.error.timestampInvalid',
          });
        }
      } else {
        const newTimestamp = xTimestamp || currentTimestamp.toString();
        request.headers['x-timestamp'] = newTimestamp;
        request.timestamp = this.helperNumberService.create(newTimestamp);
      }
    }

    return next.handle();
  }
}

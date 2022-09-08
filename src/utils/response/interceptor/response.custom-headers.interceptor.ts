import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { Response } from 'express';
import { Observable, map } from 'rxjs';

import { IRequestApp } from '@/utils/request/type';

// only for response success and error in controller
@Injectable()
export class ResponseCustomHeadersInterceptor
  implements NestInterceptor<Promise<any>>
{
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (response: Promise<Response>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const responseExpress: Response = ctx.getResponse();
          const request: IRequestApp = ctx.getRequest();

          responseExpress.setHeader('x-custom-lang', request.customLang);
          responseExpress.setHeader('x-timestamp', request.timestamp);
          responseExpress.setHeader('x-timezone', request.timezone);
          responseExpress.setHeader('x-request-id', request.correlationId);
          responseExpress.setHeader('x-version', request.version);
          responseExpress.setHeader('x-repo-version', request.repoVersion);

          return response;
        }),
      );
    }

    return next.handle();
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { EnumRequestMethod } from 'src/utils/request/request.constant';
import { IRequestApp } from 'src/utils/request/request.interface';

import { LogService } from '../service/log.service';

import { EnumLogAction, EnumLogLevel } from '../log.constant';
import { ILogOptions } from '../log.interface';

export function LogInterceptor(
  action: EnumLogAction,
  options?: ILogOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinLoggerInterceptor implements NestInterceptor<Promise<any>> {
    constructor(private readonly logService: LogService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<Promise<any> | string>> {
      if (context.getType() === 'http') {
        const ctx: HttpArgumentsHost = context.switchToHttp();
        const {
          __user,
          method,
          originalUrl,
          userAgent,
          correlationId,
          body,
          params,
        } = ctx.getRequest<IRequestApp>();
        const responseExpress = ctx.getResponse<Response>();
        return next.handle().pipe(
          tap(async (response: Promise<Record<string, any>>) => {
            const responseData: Record<string, any> = await response;
            const responseStatus: number = responseExpress?.statusCode;
            const statusCode = responseData?.statusCode
              ? responseData.statusCode
              : responseStatus;

            const logData = {
              action,
              originalUrl,
              description:
                options?.description ||
                `${method} ${originalUrl} called, action: ${
                  action || 'GENERAL'
                }`,
              user: __user,
              correlationId,
              method: method as EnumRequestMethod,
              role: __user?.role,
              params,
              bodies: body,
              statusCode,
              userAgent,
              tags: options?.tags,
            };

            const logMethods = {
              [EnumLogLevel.Fatal]: this.logService.fatal,
              [EnumLogLevel.Debug]: this.logService.debug,
              [EnumLogLevel.Warn]: this.logService.warn,
              [EnumLogLevel.Info]: this.logService.info,
            };

            await (logMethods[options?.level]?.(logData) ||
              logMethods[EnumLogLevel.Info]?.(logData));
          }),
        );
      }

      return next.handle();
    }
  }

  return mixin(MixinLoggerInterceptor);
}

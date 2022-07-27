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

import { Log } from '../entity';

import { LogService } from '../service/log.service';

import { EnumLogAction, EnumLogLevel } from '../log.constant';
import { ILog, ILogOptions } from '../log.interface';

export function LogInterceptor(
  action: EnumLogAction,
  options?: ILogOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinLoggerInterceptor implements NestInterceptor<Promise<any>> {
    private readonly logMethods: Record<
      EnumLogLevel,
      (data: ILog) => Promise<Log>
    >;
    constructor(private readonly logService: LogService) {
      this.logMethods = {
        [EnumLogLevel.Fatal]: (data: ILog) => this.logService.fatal(data),
        [EnumLogLevel.Debug]: (data: ILog) => this.logService.debug(data),
        [EnumLogLevel.Warn]: (data: ILog) => this.logService.warn(data),
        [EnumLogLevel.Info]: (data: ILog) => this.logService.info(data),
      };
    }

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
          version,
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
              version,
              description:
                options?.description ||
                `${method} ${originalUrl} ${version} called, ${action}`,
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

            await this.logMethods[options?.level || EnumLogLevel.Info]?.(
              logData,
            );
          }),
        );
      }

      return next.handle();
    }
  }

  return mixin(MixinLoggerInterceptor);
}

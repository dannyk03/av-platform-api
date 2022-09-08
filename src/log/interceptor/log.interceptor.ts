import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';

import { Response } from 'express';
import { Observable, tap } from 'rxjs';

import { LogService } from '../service';
import { HelperMaskService } from '@/utils/helper/service';

import { ILogOptions } from '../type/log.interface';
import { IRequestApp } from '@/utils/request/type';

import {
  EnumLogAction,
  EnumLogLevel,
  LOG_ACTION_META_KEY,
  LOG_OPTIONS_META_KEY,
} from '../constant';
import { EnumRequestMethod } from '@/utils/request/constant';

@Injectable()
export class LogInterceptor implements NestInterceptor<any> {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: LogService,
    private readonly helperMaskService: HelperMaskService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === 'http') {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const {
        method,
        originalUrl,
        __user,
        correlationId,
        body,
        params,
        path,
        version,
        repoVersion,
        userAgent,
      } = ctx.getRequest<IRequestApp>();
      const responseExpress = ctx.getResponse<Response>();
      return next.handle().pipe(
        tap(async (response: Promise<Record<string, any>>) => {
          const responseData: Record<string, any> = await response;
          const responseStatus: number = responseExpress.statusCode;
          const statusCode =
            responseData && responseData.statusCode
              ? responseData.statusCode
              : responseStatus;

          const loggerAction: EnumLogAction = this.reflector.get<EnumLogAction>(
            LOG_ACTION_META_KEY,
            context.getHandler(),
          );
          const loggerOptions: ILogOptions = this.reflector.get<ILogOptions>(
            LOG_OPTIONS_META_KEY,
            context.getHandler(),
          );

          await this.loggerService.raw({
            mask: loggerOptions?.mask,
            level: loggerOptions.level || EnumLogLevel.Info,
            action: loggerAction,
            description: loggerOptions.description
              ? loggerOptions.description
              : `Request ${method} called, url ${originalUrl}, action ${loggerAction}`,
            user: __user,
            role: __user?.role,
            correlationId,
            method: method as EnumRequestMethod,
            params,
            body,
            path,
            statusCode,
            userAgent,
            version,
            repoVersion,
            tags: loggerOptions?.tags || [],
          });
        }),
      );
    }

    return next.handle();
  }
}

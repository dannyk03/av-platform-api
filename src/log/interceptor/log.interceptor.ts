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

import { ILogOptions } from '../types/log.interface';
import { IRequestApp } from '@/utils/request/types';

import {
  EnumLogAction,
  EnumLogLevel,
  LOG_ACTION_META_KEY,
  LOG_OPTIONS_META_KEY,
} from '../constants';
import { EnumRequestMethod } from '@/utils/request/constants';

@Injectable()
export class LogInterceptor implements NestInterceptor<any> {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: LogService,
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
        user,
        correlationId,
        body,
        params,
        path,
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
            level: loggerOptions.level || EnumLogLevel.Info,
            action: loggerAction,
            description: loggerOptions.description
              ? loggerOptions.description
              : `Request ${method} called, url ${originalUrl}, and action ${loggerAction}`,
            user: user ? user._id : undefined,
            correlationId,
            method: method as EnumRequestMethod,
            role: user ? user.role : undefined,
            params,
            body,
            path: path ? path : undefined,
            statusCode,
            userAgent,
            tags: loggerOptions.tags ? loggerOptions.tags : [],
          });
        }),
      );
    }

    return next.handle();
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';

import { EnumInternalStatusCodeError } from '@avo/type';

import { Response } from 'express';
import { compact } from 'lodash';
import isFunction from 'lodash/isFunction';
import { Observable, catchError, tap } from 'rxjs';

import { LogService } from '../service';

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
  ) {}

  private async logHttp(
    ctx: HttpArgumentsHost,
    resOrErr: Promise<Record<string, any>> | Error,
    { loggerAction, loggerOptions },
  ) {
    const {
      method,
      originalUrl,
      __user,
      correlationId,
      body,
      params,
      headers,
      path,
      version,
      repoVersion,
      userAgent,
    } = ctx.getRequest<IRequestApp>();

    const responseExpress = ctx.getResponse<Response>();
    const responseData: Record<string, any> = await resOrErr;
    const responseStatus: number = responseExpress.statusCode;
    const statusCode =
      responseData && responseData.statusCode
        ? responseData.statusCode
        : responseStatus;

    const action = isFunction(loggerAction) ? loggerAction(body) : loggerAction;

    const isError = resOrErr instanceof Error;
    const tags = [
      ...loggerOptions?.tags,
      isError ? 'error' : null,
      isError ? resOrErr.name : null,
    ];

    await this.loggerService.raw({
      action,
      mask: loggerOptions?.mask,
      level: isError
        ? EnumLogLevel.Error
        : isFunction(loggerOptions.level)
        ? loggerOptions.level(body)
        : loggerOptions.level || EnumLogLevel.Info,
      description: loggerOptions.description
        ? loggerOptions.description
        : `Request ${method} called, url ${originalUrl}, action ${action}`,
      user: __user,
      role: __user?.role,
      correlationId,
      method: method as EnumRequestMethod,
      params,
      body,
      headers,
      path,
      statusCode,
      userAgent,
      version,
      repoVersion,
      tags: compact(tags),
      data: isError
        ? {
            error: {
              stack: resOrErr.stack,
              ...resOrErr,
            },
          }
        : null,
    });
  }

  private logHttpError(
    ctx: HttpArgumentsHost,
    error: Error,
    { loggerAction, loggerOptions },
  ) {
    this.logHttp(ctx, error, { loggerAction, loggerOptions });
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === 'http') {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const loggerAction: EnumLogAction = this.reflector.get<EnumLogAction>(
        LOG_ACTION_META_KEY,
        context.getHandler(),
      );
      const loggerOptions: ILogOptions = this.reflector.get<ILogOptions>(
        LOG_OPTIONS_META_KEY,
        context.getHandler(),
      );
      return next.handle().pipe(
        tap(async (response: Promise<Record<string, any>>) => {
          this.logHttp(ctx, response, { loggerAction, loggerOptions });
        }),
        catchError((err) => {
          this.logHttpError(ctx, err, { loggerAction, loggerOptions });
          if (err instanceof TypeError) {
            throw new InternalServerErrorException({
              detailed: false,
              statusCode: EnumInternalStatusCodeError.TypeError,
              message: 'http.serverError.internalServerError',
              data: err,
            });
          } else {
            throw err;
          }
        }),
      );
    }

    return next.handle();
  }
}

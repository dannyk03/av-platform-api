import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';

import { ClassConstructor } from 'class-transformer';
import { DeepPartial } from 'typeorm';
import { IResult } from 'ua-parser-js';

import { ILog } from '@/log';

import { RequestParamRawGuard } from './guard/request.param.guard';
import {
  EnumRequestMethod,
  REQUEST_EXCLUDE_TIMESTAMP_META_KEY,
} from './request.constant';
import { IRequestApp } from './request.interface';

export const RequestUserAgent = createParamDecorator(
  (_data: string, ctx: ExecutionContext): IResult => {
    const { userAgent } = ctx.switchToHttp().getRequest() as IRequestApp;
    return userAgent;
  },
);

export const CorrelationId = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const { correlationId } = ctx.switchToHttp().getRequest() as IRequestApp;
    return correlationId;
  },
);

export const RequestTimezone = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const { timezone } = ctx.switchToHttp().getRequest() as IRequestApp;
    return timezone;
  },
);

export const RequestTimestamp = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const { timestamp } = ctx.switchToHttp().getRequest() as IRequestApp;
    return timestamp;
  },
);

export const RequestCustomLang = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const { customLang } = ctx.switchToHttp().getRequest() as IRequestApp;
    return customLang;
  },
);

export const ReqLogData = createParamDecorator(
  (_data: string, ctx: ExecutionContext): DeepPartial<ILog> => {
    const { originalUrl, method, correlationId, version, userAgent } = ctx
      .switchToHttp()
      .getRequest<IRequestApp>();

    return {
      version,
      correlationId,
      userAgent,
      originalUrl,
      method: method as EnumRequestMethod,
    };
  },
);

export function RequestParamGuard(
  ...classValidation: ClassConstructor<any>[]
): any {
  return applyDecorators(UseGuards(RequestParamRawGuard(classValidation)));
}

export const RequestExcludeTimestamp = () =>
  SetMetadata(REQUEST_EXCLUDE_TIMESTAMP_META_KEY, true);

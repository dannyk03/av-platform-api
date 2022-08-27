import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

import { DeepPartial } from 'typeorm';
import { IResult } from 'ua-parser-js';

import { IRequestApp } from '../types';
import { ILog } from '@/log/types';

import {
  EnumRequestMethod,
  REQUEST_EXCLUDE_TIMESTAMP_META_KEY,
} from '../constants';

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
  (_data: string, ctx: ExecutionContext): number => {
    const { timestamp } = ctx.switchToHttp().getRequest() as IRequestApp;
    return timestamp;
  },
);

export const RequestCustomLang = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string[] => {
    const { customLang } = ctx.switchToHttp().getRequest() as IRequestApp;
    return customLang;
  },
);

export const ReqLogData = createParamDecorator(
  (_data: string, ctx: ExecutionContext): DeepPartial<ILog> => {
    const { path, method, correlationId, version, userAgent } = ctx
      .switchToHttp()
      .getRequest<IRequestApp>();

    return {
      version,
      path,
      correlationId,
      userAgent,
      method: method as EnumRequestMethod,
    };
  },
);

export const RequestExcludeTimestamp = () =>
  SetMetadata(REQUEST_EXCLUDE_TIMESTAMP_META_KEY, true);

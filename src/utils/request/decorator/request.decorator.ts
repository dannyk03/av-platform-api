import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

import { IResult } from 'ua-parser-js';

import { IRequestApp } from '../type';
import { IReqLogData } from '@/log/type';

import {
  EnumRequestMethod,
  REQUEST_EXCLUDE_TIMESTAMP_CHECK_KEY,
} from '../constant';

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
  (_data: string, ctx: ExecutionContext): IReqLogData => {
    const {
      __user,
      path,
      method,
      correlationId,
      version,
      userAgent,
      params,
      body,
      repoVersion,
    } = ctx.switchToHttp().getRequest<IRequestApp>();

    return {
      user: __user,
      role: __user?.role,
      correlationId,
      method: method as EnumRequestMethod,
      params,
      body,
      path,
      userAgent,
      version,
      repoVersion,
    };
  },
);

export const RequestExcludeTimestampCheck = () =>
  SetMetadata(REQUEST_EXCLUDE_TIMESTAMP_CHECK_KEY, true);

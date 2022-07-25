import { IReqLogData } from '@/log';
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { IResult } from 'ua-parser-js';
import { RequestParamRawGuard } from './guard/request.param.guard';
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
  (_data: string, ctx: ExecutionContext): IReqLogData => {
    const { originalUrl, userAgent, method, headers } = ctx
      .switchToHttp()
      .getRequest();

    return {
      correlationId: headers['x-correlation-id'],
      originalUrl,
      userAgent,
      method,
    };
  },
);

export function RequestParamGuard(
  ...classValidation: ClassConstructor<any>[]
): any {
  return applyDecorators(UseGuards(RequestParamRawGuard(classValidation)));
}

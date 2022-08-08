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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseMessageService } from '@/response-message/service';

import { IResponsePagingOptions } from '../response.interface';

import { IMessage } from '@/response-message';
import {
  EnumPaginationType,
  PAGINATION_DEFAULT_MAX_PAGE,
} from '@/utils/pagination';

// This interceptor for restructure response success
export function ResponsePagingInterceptor(
  messagePath: string,
  options?: IResponsePagingOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinResponseInterceptor implements NestInterceptor<Promise<any>> {
    constructor(private readonly messageService: ResponseMessageService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<Promise<any> | string>> {
      if (context.getType() === 'http') {
        const statusCode: number = options?.statusCode;

        return next.handle().pipe(
          map(async (response: Promise<Record<string, any>>) => {
            const ctx: HttpArgumentsHost = context.switchToHttp();
            const responseExpress: Response = ctx.getResponse();
            const { headers } = ctx.getRequest();
            const customLanguages = headers['x-custom-lang'];

            const newStatusCode = statusCode || responseExpress.statusCode;
            const responseData: Record<string, any> = await response;
            const {
              totalData,
              currentPage,
              perPage,
              data,
              metadata,
              availableSort,
              availableSearch,
            } = responseData;

            let { totalPage } = responseData;
            totalPage =
              totalPage > PAGINATION_DEFAULT_MAX_PAGE
                ? PAGINATION_DEFAULT_MAX_PAGE
                : totalPage;

            const message: string | IMessage = await this.messageService.get(
              messagePath,
              {
                customLanguages,
              },
            );

            const listData = Array.isArray(data) ? data : [data];
            if (options?.type === EnumPaginationType.Simple) {
              return {
                statusCode: newStatusCode,
                message,
                totalData,
                totalPage,
                currentPage,
                perPage,
                metadata,
                data: listData,
              };
            }

            if (options?.type === EnumPaginationType.Mini) {
              return {
                statusCode: newStatusCode,
                message,
                totalData,
                metadata,
                data: listData,
              };
            }

            return {
              statusCode: newStatusCode,
              message,
              totalData,
              totalPage,
              currentPage,
              perPage,
              availableSort,
              availableSearch,
              metadata,
              data: listData,
            };
          }),
        );
      }

      return next.handle();
    }
  }

  return mixin(MixinResponseInterceptor);
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { IResponsePaging } from '@avo/type';

import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseMessageService } from '@/response-message/service';

import { IResponsePagingOptions } from '../response.interface';

import { IMessage } from '@/response-message';
import { EnumPaginationType } from '@/utils/pagination';

// This interceptor for restructure response success
export function ResponsePagingInterceptor(
  messagePath: string,
  options?: IResponsePagingOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinResponseInterceptor implements NestInterceptor<Promise<any>> {
    constructor(
      private readonly responseMessageService: ResponseMessageService,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<Promise<IResponsePaging> | string>> {
      if (context.getType() === 'http') {
        const statusCode: number = options?.statusCode;

        return next.handle().pipe(
          map(
            async (
              responseData: Promise<Record<string, any>>,
            ): Promise<IResponsePaging> => {
              const ctx: HttpArgumentsHost = context.switchToHttp();
              const responseExpress: Response = ctx.getResponse();
              const { headers } = ctx.getRequest();
              const customLanguages = headers['x-custom-lang'];

              const newStatusCode = statusCode || responseExpress.statusCode;
              const resData: Record<string, any> = await responseData;
              const {
                totalData,
                currentPage,
                perPage,
                data,
                metadata,
                availableSort,
                availableSearch,
              } = resData;

              const { totalPage } = resData;

              const message: string | IMessage =
                await this.responseMessageService.get(messagePath, {
                  customLanguages,
                });

              const listData = Array.isArray(data) ? data : [data];
              if (options?.type === EnumPaginationType.Simple) {
                return {
                  statusCode: newStatusCode,
                  message,
                  meta: {
                    totalData,
                    totalPage,
                    currentPage,
                    perPage,
                    ...metadata,
                  },
                  results: listData,
                };
              }

              if (options?.type === EnumPaginationType.Mini) {
                return {
                  statusCode: newStatusCode,
                  message,
                  meta: {
                    totalData,
                    ...metadata,
                  },
                  results: listData,
                };
              }

              return {
                statusCode: newStatusCode,
                message,
                meta: {
                  totalData,
                  totalPage,
                  currentPage,
                  perPage,
                  availableSort,
                  availableSearch,
                  ...metadata,
                },
                results: listData,
              };
            },
          ),
        );
      }

      return next.handle();
    }
  }

  return mixin(MixinResponseInterceptor);
}

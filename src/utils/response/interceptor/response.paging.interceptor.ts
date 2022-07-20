import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
// Services
import { ResponseMessageService } from '@/response-message/service';
//
import { IResponsePagingOptions } from '../response.interface';
import {
  EnumPaginationType,
  PAGINATION_DEFAULT_MAX_PAGE,
} from '@/utils/pagination';
import { IMessage } from '@/response-message';

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
        const statusCode: number =
          options && options.statusCode ? options.statusCode : undefined;

        return next.handle().pipe(
          map(async (response: Promise<Record<string, any>>) => {
            const ctx: HttpArgumentsHost = context.switchToHttp();
            const responseExpress: Response = ctx.getResponse();
            const { headers } = ctx.getRequest();
            const customLanguages = headers['x-custom-lang'];

            const newStatusCode = statusCode
              ? statusCode
              : responseExpress.statusCode;
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

            if (options && options.type === EnumPaginationType.Simple) {
              return {
                statusCode: newStatusCode,
                message,
                totalData,
                totalPage,
                currentPage,
                perPage,
                metadata,
                data,
              };
            } else if (options && options.type === EnumPaginationType.Mini) {
              return {
                statusCode: newStatusCode,
                message,
                totalData,
                metadata,
                data,
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
              data,
            };
          }),
        );
      }

      return next.handle();
    }
  }

  return mixin(MixinResponseInterceptor);
}

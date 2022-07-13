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
import { IMessage } from '@/response-message/response-message.interface';
import { ResponseMessageService } from '@/response-message/service/response-message.service';
import { PAGINATION_DEFAULT_MAX_PAGE } from '@/utils/pagination/pagination.constant';

// This interceptor for restructure response success
export function ResponsePagingInterceptor(
  messagePath: string,
  customStatusCode: number,
): Type<NestInterceptor> {
  @Injectable()
  class MixinResponseInterceptor implements NestInterceptor<Promise<any>> {
    constructor(
      private readonly responseMessageService: ResponseMessageService,
    ) {}

    async intercept(
      ctx: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<Promise<any> | string>> {
      const context: HttpArgumentsHost = ctx.switchToHttp();
      const responseExpress: any = context.getResponse();

      const request: Request = context.getRequest<Request>();
      const { headers } = request;
      const appLanguages: string[] = headers['x-custom-lang']
        ? context.getRequest().i18nLang.split(',')
        : undefined;

      return next.handle().pipe(
        map(async (response: Promise<Record<string, any>>) => {
          const statusCode: number =
            customStatusCode || responseExpress.statusCode;
          const responseData: Record<string, any> = await response;
          const {
            totalData,
            currentPage,
            perPage,
            data,
            availableSort,
            availableSearch,
          } = responseData;

          let { totalPage } = responseData;

          const message: string | IMessage =
            (await this.responseMessageService.get(messagePath, {
              appLanguages,
            })) || (await this.responseMessageService.get('response.default'));

          totalPage =
            totalPage > PAGINATION_DEFAULT_MAX_PAGE
              ? PAGINATION_DEFAULT_MAX_PAGE
              : totalPage;

          return {
            statusCode,
            message,
            totalData,
            totalPage,
            currentPage,
            perPage,
            availableSort,
            availableSearch,
            data,
          };
        }),
      );
    }
  }

  return mixin(MixinResponseInterceptor);
}

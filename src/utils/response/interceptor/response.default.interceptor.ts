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

import { IResponse } from '../response.interface';

import { IMessage } from '@/response-message';
import { IRequestApp } from '@/utils/request';

export function ResponseDefaultInterceptor(
  messagePath: string,
): Type<NestInterceptor> {
  @Injectable()
  class MixinResponseDefaultInterceptor
    implements NestInterceptor<Promise<any>>
  {
    constructor(
      private readonly responseMessageService: ResponseMessageService,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<Promise<any> | string>> {
      if (context.getType() === 'http') {
        return next.handle().pipe(
          map(async (responseData: Promise<Record<string, any>>) => {
            const ctx: HttpArgumentsHost = context.switchToHttp();
            const response: Response = ctx.getResponse();
            const { customLang } = ctx.getRequest<IRequestApp>();
            const customLanguages = customLang?.split(',') || [];
            let resStatusCode = response.statusCode;
            let resMessage: string | IMessage =
              await this.responseMessageService.get(messagePath, {
                customLanguages,
              });
            const resData = (await responseData) as IResponse;
            if (resData) {
              const { metadata, ...data } = resData;

              // metadata
              let resMetadata = {};
              if (metadata) {
                const { statusCode, message, ...metadataOthers } = metadata;
                resStatusCode = statusCode || resStatusCode;
                resMessage = message
                  ? await this.responseMessageService.get(message, {
                      customLanguages,
                    })
                  : resMessage;
                resMetadata = metadataOthers;
              }

              return {
                statusCode: resStatusCode,
                message: resMessage,
                metadata:
                  Object.keys(resMetadata).length > 0 ? resMetadata : undefined,
                data,
              };
            }

            return {
              statusCode: resStatusCode,
              message: resMessage,
              data: resData === null ? null : undefined,
            };
          }),
        );
      }

      return next.handle();
    }
  }

  return mixin(MixinResponseDefaultInterceptor);
}

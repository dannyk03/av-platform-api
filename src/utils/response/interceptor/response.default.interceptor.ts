import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { IResponse, IResponseData } from '@avo/type';

import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseMessageService } from '@/response-message/service';

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
    ): Promise<Observable<Promise<IResponse> | string>> {
      if (context.getType() === 'http') {
        return next.handle().pipe(
          map(
            async (
              responseData: Promise<IResponseData>,
            ): Promise<IResponse> => {
              const ctx: HttpArgumentsHost = context.switchToHttp();
              const response: Response = ctx.getResponse();
              const { customLang } = ctx.getRequest<IRequestApp>();
              const customLanguages = customLang?.split(',') || [];
              let resStatusCode = response.statusCode;
              let resMessage: string | IMessage =
                await this.responseMessageService.get(messagePath, {
                  customLanguages,
                });
              const resData = await responseData;
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

                  ...(Object.keys(resMetadata).length && {
                    meta: {
                      ...resMetadata,
                    },
                  }),

                  result: data,
                };
              }

              return {
                statusCode: resStatusCode,
                message: resMessage,
                result: resData === null ? null : undefined,
              };
            },
          ),
        );
      }

      return next.handle();
    }
  }

  return mixin(MixinResponseDefaultInterceptor);
}

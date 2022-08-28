import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';

import { IMessage, IResponsePaging, IResponsePagingData } from '@avo/type';

import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

import { ResponseMessageService } from '@/response-message/service';

import { IRequestApp } from '@/utils/request/type';

import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_PAGING_TYPE_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
  RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from '../constant/response.constant';

import { IMessageOptionsProperties } from '@/response-message';
import { EnumPaginationType } from '@/utils/pagination';

@Injectable()
export class ResponsePagingInterceptor
  implements NestInterceptor<Promise<any>>
{
  constructor(
    private readonly reflector: Reflector,
    private readonly responseMessageService: ResponseMessageService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<IResponsePaging>>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (responseData: Promise<IResponsePagingData>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const responseExpress: Response = ctx.getResponse();

          const messagePath: string = this.reflector.get<string>(
            RESPONSE_MESSAGE_PATH_META_KEY,
            context.getHandler(),
          );
          const type: EnumPaginationType =
            this.reflector.get<EnumPaginationType>(
              RESPONSE_PAGING_TYPE_META_KEY,
              context.getHandler(),
            );
          const classSerialization: ClassConstructor<any> = this.reflector.get<
            ClassConstructor<any>
          >(RESPONSE_SERIALIZATION_META_KEY, context.getHandler());
          const classSerializationOptions: ClassTransformOptions =
            this.reflector.get<ClassTransformOptions>(
              RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
              context.getHandler(),
            );
          const messageProperties: IMessageOptionsProperties =
            this.reflector.get<IMessageOptionsProperties>(
              RESPONSE_MESSAGE_PROPERTIES_META_KEY,
              context.getHandler(),
            );

          // message base on language
          const { customLang } = ctx.getRequest<IRequestApp>();

          // response
          const { data, ...meta } = await responseData;
          const statusCode: number = responseExpress.statusCode;
          const properties: IMessageOptionsProperties = messageProperties;
          let serialization = data;

          if (classSerialization) {
            serialization = plainToInstance(
              classSerialization,
              data,
              classSerializationOptions,
            );
          }

          // message
          const message: string | IMessage =
            await this.responseMessageService.get(messagePath, {
              customLanguages: customLang,
              properties,
            });

          const responseHttp: IResponsePaging = {
            statusCode,
            message,
            meta,
            results: serialization,
          };

          if (
            type === EnumPaginationType.Simple ||
            type === EnumPaginationType.Mini
          ) {
            delete responseHttp.meta.totalPage;
            delete responseHttp.meta.currentPage;
            delete responseHttp.meta.perPage;
          }

          if (type === EnumPaginationType.Mini) {
            delete responseHttp.meta.availableSort;
            delete responseHttp.meta.availableSearch;
          }

          return responseHttp;
        }),
      );
    }

    return next.handle();
  }
}

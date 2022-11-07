import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';

import { IResponse, IResponseData } from '@avo/type';

import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

import { ResponseMessageService } from '@/response-message/service';

import { IErrorHttpFilterMetadata } from '@/utils/error/type';
import { IRequestApp } from '@/utils/request/type';

import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
  RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from '../constant';

import { IMessageOptionsProperties } from '@/response-message';

@Injectable()
export class ResponseDefaultInterceptor<T = any>
  implements NestInterceptor<Promise<T>>
{
  constructor(
    private readonly reflector: Reflector,
    private readonly responseMessageService: ResponseMessageService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<IResponse>>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(
          async (responseData: Promise<IResponseData>): Promise<IResponse> => {
            const ctx: HttpArgumentsHost = context.switchToHttp();
            const responseExpress: Response = ctx.getResponse();
            const requestExpress: IRequestApp = ctx.getRequest<IRequestApp>();

            let messagePath: string = this.reflector.get<string>(
              RESPONSE_MESSAGE_PATH_META_KEY,
              context.getHandler(),
            );
            const classSerialization: ClassConstructor<any> =
              this.reflector.get<ClassConstructor<any>>(
                RESPONSE_SERIALIZATION_META_KEY,
                context.getHandler(),
              );
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

            // default response
            let statusCode: number = responseExpress.statusCode;
            let message = await this.responseMessageService.get(messagePath, {
              customLanguages: customLang,
              properties: messageProperties,
            });

            // get metadata
            const __path = requestExpress.path;
            const __correlationId = requestExpress.correlationId;
            const __timestamp = requestExpress.timestamp;
            const __timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const __version = requestExpress.version;
            const __repoVersion = requestExpress.repoVersion;

            const resMetadata: IErrorHttpFilterMetadata = {
              timestamp: __timestamp,
              timezone: __timezone,
              correlationId: __correlationId,
              path: __path,
              version: __version,
              repoVersion: __repoVersion,
            };

            // response
            const response = (await responseData) as IResponse;
            if (response) {
              const { meta, ...data } = response;
              let properties: IMessageOptionsProperties = messageProperties;
              let serialization = data;

              if (classSerialization) {
                serialization = plainToInstance(
                  classSerialization,
                  data,
                  classSerializationOptions,
                );
              }

              if (meta) {
                statusCode = meta.statusCode || statusCode;
                messagePath = meta.message || messagePath;
                properties = meta.properties || properties;

                delete meta.statusCode;
                delete meta.message;
                delete meta.properties;
              }

              // message
              message = await this.responseMessageService.get(messagePath, {
                customLanguages: customLang,
                properties,
              });

              serialization =
                serialization && Object.keys(serialization).length
                  ? serialization
                  : null;

              return {
                statusCode,
                message,
                meta: { ...resMetadata, ...meta },
                result: serialization,
              };
            }

            return {
              statusCode,
              message,
              meta: resMetadata,
              result: typeof response === 'undefined' ? response : null,
            };
          },
        ),
      );
    }

    return next.handle();
  }
}

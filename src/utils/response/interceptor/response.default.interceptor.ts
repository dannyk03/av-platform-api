import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';

import { IResponse } from '@avo/type';

import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

import { ResponseMessageService } from '@/response-message/service';

import { IMessageOptionsProperties } from '@/response-message';
import { IErrorHttpFilterMetadata } from '@/utils/error';
import { IRequestApp } from '@/utils/request';

import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
  RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from '../response.constant';

@Injectable()
export class ResponseDefaultInterceptor
  implements NestInterceptor<Promise<any>>
{
  constructor(
    private readonly reflector: Reflector,
    private readonly messageService: ResponseMessageService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<IResponse>>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (responseData: Promise<Record<string, any>>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const responseExpress: Response = ctx.getResponse();
          const requestExpress: IRequestApp = ctx.getRequest<IRequestApp>();

          let messagePath: string = this.reflector.get<string>(
            RESPONSE_MESSAGE_PATH_META_KEY,
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

          // default response
          let statusCode: number = responseExpress.statusCode;
          let message = await this.messageService.get(messagePath, {
            customLanguages: customLang,
          });

          // get metadata
          const __path = requestExpress.path;
          const __correlationId = requestExpress.correlationId;
          const __timestamp = requestExpress.timestamp;
          const __timezone = requestExpress.timezone;
          const __version = requestExpress.version;
          const __repoVersion = requestExpress.repoVersion;

          const resMetadata: IErrorHttpFilterMetadata = {
            languages: customLang,
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
            message = await this.messageService.get(messagePath, {
              customLanguages: customLang,
              properties,
            });

            serialization =
              serialization && Object.keys(serialization).length
                ? serialization
                : undefined;

            return {
              statusCode,
              message,
              metadata: { ...resMetadata, ...meta },
              result: serialization,
            };
          }

          return {
            statusCode,
            message,
            metadata: resMetadata,
          };
        }),
      );
    }

    return next.handle();
  }
}

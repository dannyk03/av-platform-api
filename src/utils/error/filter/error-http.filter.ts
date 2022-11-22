// If we throw error with HttpException, there will always return object
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Optional,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

import { IErrors, IMessage } from '@avo/type';

import { ValidationError, isObject } from 'class-validator';
import { Response } from 'express';

import { DebuggerService } from '@/debugger/service';
import { ResponseMessageService } from '@/response-message/service';
import { HelperDateService } from '@/utils/helper/service';

import {
  IErrorException,
  IErrorHttpFilter,
  IErrorHttpFilterMetadata,
  IErrorsImport,
  IValidationErrorImport,
} from '../type';
import { IRequestApp } from '@/utils/request/type';

import { EnumErrorType } from '../constant';

@Catch()
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(
    @Optional() private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly responseMessageService: ResponseMessageService,
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly helperDateService: HelperDateService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request = ctx.getRequest<IRequestApp>();

    // get request headers
    const customLang =
      ctx.getRequest<IRequestApp>().customLang ||
      this.configService.get<string>('app.language').split(',');

    // get metadata
    const __class = request.__class || ErrorHttpFilter.name;
    const __function = request.__function || this.catch.name;
    const __correlationId = request.correlationId;
    const __path = request.path;
    const __timestamp = request.timestamp || this.helperDateService.timestamp();
    const __timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const __version =
      request.version ||
      this.configService.get<string>('app.versioning.version');
    const __repoVersion =
      request.repoVersion || this.configService.get<string>('app.repoVersion');

    if (exception instanceof HttpException) {
      const statusHttp: number = exception.getStatus();
      const responseExpress: Response = ctx.getResponse<Response>();

      // Restructure
      const response = exception.getResponse();

      if (!this.isErrorException(response)) {
        responseExpress.status(statusHttp).json(response);

        return;
      }

      const {
        statusCode,
        message,
        silent,
        detailed,
        error,
        errorType,
        data,
        properties,
        metadata,
      } = response;

      // Debugger
      const i18ErrorMessage = await this.responseMessageService.get(
        exception.message,
        {
          customLanguages: customLang,
          properties,
        },
      );
      this.debuggerService?.error(
        request.correlationId ?? ErrorHttpFilter.name,
        {
          description: i18ErrorMessage as string,
          class: __class,
          function: __function,
          path: __path,
        },
        {
          ...exception,
          message: i18ErrorMessage,
        },
      );

      let { errors } = response;
      if (errors?.length) {
        errors =
          errorType === EnumErrorType.IMPORT
            ? await this.responseMessageService.getImportErrorsMessage(
                errors as IValidationErrorImport[],
                customLang,
              )
            : await this.responseMessageService.getRequestErrorsMessage(
                errors as ValidationError[],
                customLang,
              );
      }

      const mapMessage: string | IMessage =
        await this.responseMessageService.get(message, {
          customLanguages: customLang,
          properties,
        });

      const resMetadata: IErrorHttpFilterMetadata = {
        timestamp: __timestamp,
        timezone: __timezone,
        correlationId: __correlationId,
        path: __path,
        version: __version,
        repoVersion: __repoVersion,
        ...metadata,
      };

      const resResponse: IErrorHttpFilter = {
        statusCode: statusCode || statusHttp,
        message: mapMessage,
        error: detailed
          ? error && Object.keys(error).length
            ? error
            : exception.message
          : undefined,
        errors: errors as IErrors[] | IErrorsImport[],
        meta: resMetadata,
        data,
      };

      responseExpress
        .setHeader('x-custom-lang', customLang)
        .setHeader('x-timestamp', __timestamp)
        .setHeader('x-timezone', __timezone)
        .setHeader('x-request-id', __correlationId)
        .setHeader('x-version', __version)
        .setHeader('x-repo-version', __repoVersion)
        .status(silent ? HttpStatus.OK : statusHttp)
        .json(silent ? { status: 'OK' } : resResponse);
    } else {
      // In certain situations `httpAdapter` might not be available in the
      // constructor method, thus we should resolve it here.
      const { httpAdapter } = this.httpAdapterHost;
      const message: string = (await this.responseMessageService.get(
        'http.serverError.internalServerError',
      )) as string;

      const metadata: IErrorHttpFilterMetadata = {
        timestamp: __timestamp,
        timezone: __timezone,
        requestId: __correlationId,
        path: __path,
        version: __version,
        repoVersion: __repoVersion,
      };

      const responseBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        error:
          exception instanceof Error &&
          'message' in exception &&
          exception.message,

        metadata,
      };

      const responseExpress = ctx.getResponse();
      responseExpress
        .setHeader('x-custom-lang', customLang)
        .setHeader('x-timestamp', __timestamp)
        .setHeader('x-timezone', __timezone)
        .setHeader('x-correlation-id', __correlationId)
        .setHeader('x-version', __version)
        .setHeader('x-repo-version', __repoVersion);

      // Debugger
      this.debuggerService?.error(
        ErrorHttpFilter.name,
        {
          description: message,
          class: ErrorHttpFilter.name,
          function: 'catch',
          path: __path,
        },
        exception,
      );

      httpAdapter.reply(
        responseExpress,
        responseBody,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  isErrorException(obj: any): obj is IErrorException {
    return isObject(obj) && 'statusCode' in obj && 'message' in obj;
  }
}

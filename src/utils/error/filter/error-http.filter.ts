// If we throw error with HttpException, there will always return object
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { IErrors, IMessage } from '@avo/type';

import { ValidationError } from 'class-validator';
import { Response } from 'express';

import { DebuggerService } from '@/debugger/service';
import { ResponseMessageService } from '@/response-message/service';

import {
  IErrorException,
  IErrorHttpFilter,
  IErrorHttpFilterMetadata,
  IErrorsImport,
  IValidationErrorImport,
} from '../error.interface';

import { IRequestApp } from '@/utils/request';

import { EnumErrorType } from '../error.constant';

// The exception filter only catch HttpException
@Catch(HttpException)
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(
    private readonly messageService: ResponseMessageService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const statusHttp: number = exception.getStatus();
    const request = ctx.getRequest<IRequestApp>();
    const responseExpress: Response = ctx.getResponse<Response>();

    // get request headers
    const reqCustomLang = request.header('x-custom-lang');

    // get metadata
    const __class = request.__class;
    const __function = request.__function;
    const __path = request.path;
    const __correlationId = request.correlationId;
    const __timestamp = request.timestamp;
    const __timezone = request.timezone;
    const __version = request.version;
    const __repoVersion = request.repoVersion;

    // message base in language
    const { customLang } = ctx.getRequest<IRequestApp>();

    // Debugger
    this.debuggerService.error(
      request?.correlationId || ErrorHttpFilter.name,
      {
        description: exception.message,
        class: __class,
        function: __function,
        path: __path,
      },
      exception,
    );

    // Restructure
    const response = exception.getResponse();

    if (!this.isErrorException(response)) {
      responseExpress.status(statusHttp).json(response);

      return;
    }

    const responseException = response as IErrorException;
    const {
      statusCode,
      message,
      error,
      errorType,
      data,
      properties,
      metadata,
    } = responseException;

    let { errors } = responseException;
    if (errors && errors.length) {
      errors =
        errorType === EnumErrorType.IMPORT
          ? await this.messageService.getImportErrorsMessage(
              errors as IValidationErrorImport[],
              customLang,
            )
          : await this.messageService.getRequestErrorsMessage(
              errors as ValidationError[],
              customLang,
            );
    }

    const mapMessage: string | IMessage = await this.messageService.get(
      message,
      { customLanguages: customLang, properties },
    );

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
      error: error && Object.keys(error).length ? error : undefined,
      errors: errors as IErrors[] | IErrorsImport[],
      metadata: resMetadata,
      data,
    };

    responseExpress
      .setHeader('x-custom-lang', reqCustomLang)
      .setHeader('x-timestamp', __timestamp)
      .setHeader('x-timezone', __timezone)
      .setHeader('x-request-id', __correlationId)
      .setHeader('x-version', __version)
      .setHeader('x-repo-version', __repoVersion)
      .status(statusHttp)
      .json(resResponse);

    return;
  }

  isErrorException(obj: any): obj is IErrorException {
    return 'statusCode' in obj && 'message' in obj;
  }
}

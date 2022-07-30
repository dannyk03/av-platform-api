import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { Response } from 'express';

import { DebuggerService } from '@/debugger/service/debugger.service';
import { ResponseMessageService } from '@/response-message/service';

import { IErrorException } from '../error.interface';

import { IMessage } from '@/response-message';
import { IRequestApp } from '@/utils/request';

@Catch(HttpException)
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(
    private readonly responseMessageService: ResponseMessageService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const statusHttp: number = exception.getStatus();
    const request = ctx.getRequest<IRequestApp>();
    const response = exception.getResponse();
    const { customLang } = ctx.getRequest<IRequestApp>();
    const customLanguages: string[] = customLang.split(',');
    const responseExpress: Response = ctx.getResponse<Response>();

    // Debugger
    this.debuggerService.error(
      request?.correlationId ? request.correlationId : ErrorHttpFilter.name,
      {
        description: exception.message,
        class: request.__class,
        function: request.__function,
      },
      exception,
    );

    // Restructure
    if (
      typeof response === 'object' &&
      'statusCode' in response &&
      'message' in response
    ) {
      const responseError = response as IErrorException;
      const { statusCode, message, errors, data, properties } = responseError;

      const rErrors = errors
        ? await this.responseMessageService.getRequestErrorsMessage(
            errors,
            customLanguages,
          )
        : undefined;

      let rMessage: string | IMessage = await this.responseMessageService.get(
        message,
        {
          customLanguages,
        },
      );

      if (properties) {
        rMessage = await this.responseMessageService.get(message, {
          customLanguages,
          properties,
        });
      }

      responseExpress.status(statusHttp).json({
        statusCode: statusCode || statusHttp,
        message: rMessage,
        errors: rErrors,
        data,
      });
    } else {
      const message = await this.responseMessageService.get(
        `http.${statusHttp}`,
        {
          customLanguages,
        },
      );

      responseExpress.status(statusHttp).json({
        statusCode: statusHttp,
        message,
        data: response,
      });
    }
  }
}

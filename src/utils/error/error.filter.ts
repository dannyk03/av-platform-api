import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { IErrorException } from './error.interface';
import { IMessage } from '@/response-message/response-message.interface';
import { ResponseMessageService } from '@/response-message/service/response-message.service';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(HttpException)
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(
    private readonly responseMessageService: ResponseMessageService,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const statusHttp: number = exception.getStatus();
    const responseHttp: any = ctx.getResponse<Response>();

    const appLanguages: string[] = ctx.getRequest().i18nLang?.split(',');

    if (exception instanceof ThrottlerException) {
      const rMessage: string | IMessage = await this.responseMessageService.get(
        'request.error.tooManyRequests',
        { appLanguages },
      );
      return responseHttp.status(statusHttp).json({
        message: rMessage,
      });
    }

    if (exception instanceof ServiceUnavailableException) {
      const response = exception.getResponse() as {
        error: Record<string, any>;
      };
      const rMessage: string | IMessage = await this.responseMessageService.get(
        'health.error.check',
        { appLanguages },
      );
      return responseHttp.status(statusHttp).json({
        message: rMessage,
        data: response,
      });
    }

    // Restructure
    const response = exception.getResponse() as IErrorException;
    if (typeof response === 'object') {
      const { statusCode, message, errors, data, properties } = response;
      const rErrors = errors
        ? await this.responseMessageService.getRequestErrorsMessage(
            errors,
            appLanguages,
          )
        : undefined;

      let rMessage: string | IMessage = await this.responseMessageService.get(
        message,
        {
          appLanguages,
        },
      );

      if (properties) {
        rMessage = await this.responseMessageService.get(message, {
          appLanguages,
          properties,
        });
      }

      responseHttp.status(statusHttp).json({
        statusCode,
        message: rMessage,
        errors: rErrors,
        data,
      });
    } else {
      const rMessage: string | IMessage = await this.responseMessageService.get(
        'response.error.structure',
        { appLanguages },
      );
      responseHttp.status(statusHttp).json({
        statusCode: 500,
        message: rMessage,
      });
    }
  }
}

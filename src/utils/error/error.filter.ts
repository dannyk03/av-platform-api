import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { IErrorException } from './error.interface';
import { IMessage } from '@/message/message.interface';
import { MessageService } from '@/message/service/message.service';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(HttpException)
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(private readonly messageService: MessageService) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const statusHttp: number = exception.getStatus();
    const responseHttp: any = ctx.getResponse<Response>();

    const appLanguages: string[] = ctx.getRequest().i18nLang?.split(',');

    if (exception instanceof ThrottlerException) {
      const rMessage: string | IMessage = await this.messageService.get(
        'request.error.tooManyRequests',
        { appLanguages },
      );
      return responseHttp.status(statusHttp).json({
        statusCode: 500,
        message: rMessage,
      });
    }

    // Restructure
    const response = exception.getResponse() as IErrorException;
    if (typeof response === 'object') {
      const { statusCode, message, errors, data, properties } = response;
      const rErrors = errors
        ? await this.messageService.getRequestErrorsMessage(
            errors,
            appLanguages,
          )
        : undefined;

      let rMessage: string | IMessage = await this.messageService.get(message, {
        appLanguages,
      });

      if (properties) {
        rMessage = await this.messageService.get(message, {
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
      const rMessage: string | IMessage = await this.messageService.get(
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

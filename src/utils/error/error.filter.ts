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
import { IMessage } from '@/message/message.interface';
import { MessageService } from '@/message/service/message.service';

@Catch(HttpException)
export class ErrorHttpFilter implements ExceptionFilter {
    constructor(private readonly messageService: MessageService) {}

    async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const statusHttp: number = exception.getStatus();
        const responseHttp: any = ctx.getResponse<Response>();

        if (exception instanceof ServiceUnavailableException) {
            const response = exception.getResponse();

            const error = response['error'];
            if (typeof error === 'object') {
                return responseHttp.status(statusHttp).json({
                    errors: Object.keys(error).map((key) => error[key]),
                    statusCode: statusHttp,
                    message: await this.messageService.get(
                        'health.error.check',
                    ),
                });
            }
            return responseHttp.status(statusHttp).json();
        }

        const appLanguages: string[] = ctx.getRequest().i18nLang
            ? ctx.getRequest().i18nLang.split(',')
            : undefined;

        // Restructure
        const response = exception.getResponse() as IErrorException;
        if (typeof response === 'object') {
            const { statusCode, message, errors, error, data, properties } =
                response;
            const rErrors =
                errors || error
                    ? await this.messageService.getRequestErrorsMessage(
                          errors || [error],
                          appLanguages,
                      )
                    : undefined;

            let rMessage: string | IMessage = await this.messageService.get(
                message,
                { appLanguages },
            );

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

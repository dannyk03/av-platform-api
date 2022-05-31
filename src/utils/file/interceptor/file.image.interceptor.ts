import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnprocessableEntityException,
    PayloadTooLargeException,
    UnsupportedMediaTypeException,
    Type,
    mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { FileImageMime, FileStatusCodeError } from '../file.constant';
import { IFile } from '../file.interface';

export function FileImageInterceptor(
    required?: boolean,
): Type<NestInterceptor> {
    @Injectable()
    class MixinFileImageInterceptor implements NestInterceptor<Promise<any>> {
        constructor(private readonly configService: ConfigService) {}

        async intercept(
            context: ExecutionContext,
            next: CallHandler,
        ): Promise<Observable<Promise<any> | string>> {
            const ctx: HttpArgumentsHost = context.switchToHttp();
            const { file, files } = ctx.getRequest();

            const finalFiles = files || file;

            if (Array.isArray(finalFiles)) {
                const maxFiles =
                    this.configService.get<number>('file.maxFiles');

                if (required && finalFiles.length === 0) {
                    throw new UnprocessableEntityException({
                        statusCode: FileStatusCodeError.FileNeededError,
                        message: 'file.error.notFound',
                    });
                } else if (finalFiles.length > maxFiles) {
                    throw new UnprocessableEntityException({
                        statusCode: FileStatusCodeError.FileMaxError,
                        message: 'file.error.maxFiles',
                    });
                }

                for (const file of finalFiles) {
                    await this.validate(file);
                }
            } else {
                await this.validate(finalFiles);
            }

            return next.handle();
        }

        async validate(file: IFile): Promise<void> {
            if (required && !file) {
                throw new UnprocessableEntityException({
                    statusCode: FileStatusCodeError.FileNeededError,
                    message: 'file.error.notFound',
                });
            } else if (file) {
                const { size, mimetype } = file;

                const maxSize =
                    this.configService.get<number>('file.maxFileSize');
                if (
                    !Object.values(FileImageMime).find(
                        (val) => val === mimetype.toLowerCase(),
                    )
                ) {
                    throw new UnsupportedMediaTypeException({
                        statusCode: FileStatusCodeError.FileExtensionError,
                        message: 'file.error.mimeInvalid',
                    });
                } else if (size > maxSize) {
                    throw new PayloadTooLargeException({
                        statusCode: FileStatusCodeError.FileMaxSizeError,
                        message: 'file.error.maxSize',
                    });
                }
            }
        }
    }

    return mixin(MixinFileImageInterceptor);
}

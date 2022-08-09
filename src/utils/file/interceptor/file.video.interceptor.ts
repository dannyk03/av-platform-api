import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  PayloadTooLargeException,
  Type,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
  mixin,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';

import { EnumFileStatusCodeError } from '@avo/type';

import { Observable } from 'rxjs';

import { IFile, IFileAudioOptions } from '../file.interface';

import { EnumFileVideoMime } from '../file.constant';

export function FileVideoInterceptor(
  options?: IFileAudioOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinFileImageInterceptor implements NestInterceptor<Promise<any>> {
    constructor(private readonly configService: ConfigService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<Promise<any> | string>> {
      if (context.getType() === 'http') {
        const ctx: HttpArgumentsHost = context.switchToHttp();
        const { file, files } = ctx.getRequest();

        const finalFiles = files || file;

        if (Array.isArray(finalFiles)) {
          const maxFiles = this.configService.get<number>(
            'file.video.maxFiles',
          );

          if (options?.required && finalFiles.length === 0) {
            throw new UnprocessableEntityException({
              statusCode: EnumFileStatusCodeError.FileNeededError,
              message: 'file.error.notFound',
            });
          } else if (finalFiles.length > maxFiles) {
            throw new UnprocessableEntityException({
              statusCode: EnumFileStatusCodeError.FileMaxError,
              message: 'file.error.maxFiles',
            });
          }

          await Promise.all(finalFiles.map(this.validate.bind(this)));
        } else {
          await this.validate(finalFiles);
        }
      }

      return next.handle();
    }

    async validate(file: IFile): Promise<void> {
      if (options?.required && !file) {
        throw new UnprocessableEntityException({
          statusCode: EnumFileStatusCodeError.FileNeededError,
          message: 'file.error.notFound',
        });
      } else if (file) {
        const { size, mimetype } = file;

        const maxSize = this.configService.get<number>(
          'file.video.maxFileSize',
        );
        if (
          !Object.values(EnumFileVideoMime).find(
            (val) => val === mimetype.toLowerCase(),
          )
        ) {
          throw new UnsupportedMediaTypeException({
            statusCode: EnumFileStatusCodeError.FileExtensionError,
            message: 'file.error.mimeInvalid',
          });
        } else if (size > maxSize) {
          throw new PayloadTooLargeException({
            statusCode: EnumFileStatusCodeError.FileMaxSizeError,
            message: 'file.error.maxSize',
          });
        }
      }
    }
  }

  return mixin(MixinFileImageInterceptor);
}

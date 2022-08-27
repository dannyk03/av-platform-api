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

import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Observable } from 'rxjs';

import { HelperFileService } from 'src/utils/helper/service/helper.file.service';

import { IValidationErrorImport } from '@/utils/error/types';

import { EnumFileExcelMime } from '../file.constant';

import { IFile, IFileExcelOptions } from '../file.interface';

export function FileExcelInterceptor(
  options?: IFileExcelOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinFileExcelInterceptor implements NestInterceptor<Promise<any>> {
    constructor(
      private readonly configService: ConfigService,
      private readonly helperFileService: HelperFileService,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<Promise<any> | string>> {
      if (context.getType() === 'http') {
        const ctx: HttpArgumentsHost = context.switchToHttp();
        const request = ctx.getRequest();
        const { file, files } = request;

        const finalFiles = files || file;

        if (Array.isArray(finalFiles)) {
          const maxFiles = this.configService.get<number>(
            'file.excel.maxFiles',
          );

          if (options?.required && !finalFiles?.length) {
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

          if (options?.extract) {
            let extractFiles = [];
            let rawExtractFiles = [];
            let errors: IValidationErrorImport[] = [];

            for (const singleFile of finalFiles) {
              const extract = await this.helperFileService.readExcel(
                singleFile.buffer,
              );
              rawExtractFiles = [...rawExtractFiles, ...extract];

              try {
                const serialization = await this.excelValidate(
                  extract,
                  singleFile.originalname,
                );
                extractFiles = [...extractFiles, ...serialization];
              } catch (err: any) {
                errors = [...errors, ...err];
              }
            }

            if (errors.length) {
              throw new UnprocessableEntityException({
                statusCode: EnumFileStatusCodeError.FileValidationDtoError,
                message: 'file.error.validationDto',
                errors,
                errorFromImport: true,
              });
            }

            request.__extractFiles = extractFiles;
            request.__rawExtractFiles = rawExtractFiles;
          }
        } else {
          await this.validate(finalFiles);

          if (options?.extract) {
            const extract = await this.helperFileService.readExcel(file.buffer);

            try {
              const serialization: Record<string, any>[] =
                await this.excelValidate(extract, file.originalname);
              request.__extractFile = serialization;
              request.__rawExtractFile = extract;
            } catch (err: any) {
              throw new UnprocessableEntityException({
                statusCode: EnumFileStatusCodeError.FileValidationDtoError,
                message: 'file.error.validationDto',
                errors: err,
                errorFromImport: true,
              });
            }
          }
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
          'file.excel.maxFileSize',
        );
        if (
          !Object.values(EnumFileExcelMime).find(
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

    async excelValidate(
      extract: Record<string, any>[],
      fileName: string,
    ): Promise<Record<string, any>[]> {
      if (options?.dto) {
        const data: Record<string, any>[] = [];
        const errors: IValidationErrorImport[] = [];

        for (const [index, ext] of extract.entries()) {
          const classDto = plainToInstance<any, any>(options.dto, ext);

          const validator: ValidationError[] = await validate(classDto);
          if (validator.length) {
            errors.push({
              row: index,
              file: fileName,
              errors: validator,
            });
          } else if (errors.length) {
            continue;
          } else {
            data.push(classDto);
          }
        }

        if (errors.length) {
          throw errors;
        }

        return data;
      }
    }
  }

  return mixin(MixinFileExcelInterceptor);
}

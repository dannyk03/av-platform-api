import {
  ExecutionContext,
  UseInterceptors,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { IFileOptions } from './file.interface';

import { EnumFileType } from './file.constant';
import { FileExcelInterceptor } from './interceptor/file.excel.interceptor';
import { FileImageInterceptor } from './interceptor/file.image.interceptor';

export const GetExtractFile = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { __extractFile } = ctx.switchToHttp().getRequest();
    return __extractFile;
  },
);

export const GetExtractFiles = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { __extractFiles } = ctx.switchToHttp().getRequest();
    return __extractFiles;
  },
);

export const GetRawExtractFile = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { __rawExtractFile } = ctx.switchToHttp().getRequest();
    return __rawExtractFile;
  },
);

export const GetRawExtractFiles = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { __rawExtractFiles } = ctx.switchToHttp().getRequest();
    return __rawExtractFiles;
  },
);

export function UploadFileSingle(field: string, options?: IFileOptions): any {
  if (options?.type === EnumFileType.IMAGE) {
    return applyDecorators(
      UseInterceptors(
        FileInterceptor(field),
        FileImageInterceptor({
          required: options?.required || false,
        }),
      ),
    );
  }

  if (options?.type === EnumFileType.EXCEL) {
    return applyDecorators(
      UseInterceptors(
        FileInterceptor(field),
        FileExcelInterceptor({
          required: options?.required || false,
          extract: options?.extract || false,
          dto: options?.dto || undefined,
        }),
      ),
    );
  }

  return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function UploadFileMultiple(field: string, options?: IFileOptions): any {
  if (options?.type === EnumFileType.IMAGE) {
    return applyDecorators(
      UseInterceptors(
        FilesInterceptor(field),
        FileImageInterceptor({
          required: options?.required || false,
        }),
      ),
    );
  }

  if (options?.type === EnumFileType.EXCEL) {
    return applyDecorators(
      UseInterceptors(
        FilesInterceptor(field),
        FileExcelInterceptor({
          required: options?.required || false,
          extract: options?.extract || false,
          dto: options.dto || undefined,
        }),
      ),
    );
  }

  return applyDecorators(UseInterceptors(FilesInterceptor(field)));
}

import {
  ExecutionContext,
  SetMetadata,
  UseInterceptors,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { IRequestApp } from '@/utils/request/type';

import {
  FILE_CUSTOM_MAX_FILES_META_KEY,
  FILE_CUSTOM_SIZE_META_KEY,
} from '../constants';

import {
  FileCustomMaxFilesInterceptor,
  FileCustomSizeInterceptor,
} from '../interceptors';

export function UploadFileSingle(field: string): any {
  return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function UploadFileMultiple(field: string): any {
  return applyDecorators(UseInterceptors(FilesInterceptor(field)));
}

export function FileCustomMaxFile(customMaxFiles: number): any {
  return applyDecorators(
    UseInterceptors(FileCustomMaxFilesInterceptor),
    SetMetadata(FILE_CUSTOM_MAX_FILES_META_KEY, customMaxFiles),
  );
}

export function FileCustomSize(customSize: string): any {
  return applyDecorators(
    UseInterceptors(FileCustomSizeInterceptor),
    SetMetadata(FILE_CUSTOM_SIZE_META_KEY, customSize),
  );
}

export const FilePartNumber = createParamDecorator(
  (data: string, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest() as IRequestApp;
    return request.headers['x-part-number']
      ? parseInt(request.headers['x-part-number'] as string)
      : 0;
  },
);

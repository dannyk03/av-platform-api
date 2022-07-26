import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { EnumFileType } from './file.constant';
import { FileImageInterceptor } from './interceptor';

export function UploadFileSingle(
  field: string,
  type: EnumFileType,
  required?: boolean,
): any {
  if (type === EnumFileType.Image) {
    return applyDecorators(
      UseInterceptors(FileInterceptor(field), FileImageInterceptor(required)),
    );
  }

  return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function UploadFileMultiple(
  field: string,
  type: EnumFileType,
  required?: boolean,
): any {
  if (type === EnumFileType.Image) {
    return applyDecorators(
      UseInterceptors(FilesInterceptor(field), FileImageInterceptor(required)),
    );
  }

  return applyDecorators(UseInterceptors(FilesInterceptor(field)));
}

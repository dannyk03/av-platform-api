import { Injectable, PipeTransform } from '@nestjs/common';

import {
  EnumFileAudioMime,
  EnumFileExcelMime,
  EnumFileImageMime,
  EnumFileVideoMime,
} from '@avo/type';

import { IFile } from '../type';

import { mimetypeValidate } from './utils';

@Injectable()
export class FileTypeImagePipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    return await mimetypeValidate({
      value,
      allowedMimeTypes: Object.values(EnumFileImageMime),
    });
  }
}

@Injectable()
export class FileTypeVideoPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    return await mimetypeValidate({
      value,
      allowedMimeTypes: Object.values(EnumFileVideoMime),
    });
  }
}

@Injectable()
export class FileTypeAudioPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    return await mimetypeValidate({
      value,
      allowedMimeTypes: Object.values(EnumFileAudioMime),
    });
  }
}

@Injectable()
export class FileTypeExcelPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    return await mimetypeValidate({
      value,
      allowedMimeTypes: Object.values(EnumFileExcelMime),
    });
  }
}

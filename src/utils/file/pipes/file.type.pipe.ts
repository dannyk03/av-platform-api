import {
  Injectable,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import {
  EnumFileAudioMime,
  EnumFileExcelMime,
  EnumFileImageMime,
  EnumFileStatusCodeError,
  EnumFileVideoMime,
} from '@avo/type';

import { IFile } from '../type';

@Injectable()
export class FileTypeImagePipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (!value) {
      return;
      return;
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.mimetype);
      }

      return value;
    }

    const file = value as IFile;
    await this.validate(file.mimetype);

    return value;
  }

  async validate(mimetype: string): Promise<void> {
    if (
      !Object.values(EnumFileImageMime).find(
        (val) => val === mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: EnumFileStatusCodeError.FileExtensionError,
        message: 'file.error.mimeInvalid',
      });
    }

    return;
  }
}

@Injectable()
export class FileTypeVideoPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.mimetype);
      }

      return value;
    }

    const file = value as IFile;
    await this.validate(file.mimetype);

    return value;
  }

  async validate(mimetype: string): Promise<void> {
    if (
      !Object.values(EnumFileVideoMime).find(
        (val) => val === mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: EnumFileStatusCodeError.FileExtensionError,
        message: 'file.error.mimeInvalid',
      });
    }

    return;
  }
}

@Injectable()
export class FileTypeAudioPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.mimetype);
      }

      return value;
    }

    const file = value as IFile;
    await this.validate(file.mimetype);

    return value;
  }

  async validate(mimetype: string): Promise<void> {
    if (
      !Object.values(EnumFileAudioMime).find(
        (val) => val === mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: EnumFileStatusCodeError.FileExtensionError,
        message: 'file.error.mimeInvalid',
      });
    }

    return;
  }
}

@Injectable()
export class FileTypeExcelPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.mimetype);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.mimetype);

    return value;
  }

  async validate(mimetype: string): Promise<void> {
    if (
      !Object.values(EnumFileExcelMime).find(
        (val) => val === mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: EnumFileStatusCodeError.FileExtensionError,
        message: 'file.error.mimeInvalid',
      });
    }

    return;
  }
}

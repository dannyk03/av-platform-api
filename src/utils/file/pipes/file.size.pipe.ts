import {
  Inject,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { EnumFileStatusCodeError } from '@avo/type';

import { HelperFileService } from '@/utils/helper/service';

import { IFile } from '../type';

@Injectable({ scope: Scope.REQUEST })
export class FileSizeImagePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {}

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (!value) {
      return value;
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.size);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.size);

    return value;
  }

  async validate(size: number): Promise<void> {
    const maxSizeInBytes = this.request.__customFileSize
      ? this.helperFileService.convertToBytes(this.request.__customFileSize)
      : this.configService.get<number>('file.image.maxFileSize');

    if (size > maxSizeInBytes) {
      throw new PayloadTooLargeException({
        statusCode: EnumFileStatusCodeError.FileMaxSizeError,
        message: 'file.error.maxSize',
      });
    }
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileSizeExcelPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {}

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.size);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.size);

    return value;
  }

  async validate(size: number): Promise<void> {
    const maxSizeInBytes = this.request.__customFileSize
      ? this.helperFileService.convertToBytes(this.request.__customFileSize)
      : this.configService.get<number>('file.excel.maxFileSize');

    if (size > maxSizeInBytes) {
      throw new PayloadTooLargeException({
        statusCode: EnumFileStatusCodeError.FileMaxSizeError,
        message: 'file.error.maxSize',
      });
    }
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileSizeVideoPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {}

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.size);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.size);

    return value;
  }

  async validate(size: number): Promise<void> {
    const maxSizeInBytes = this.request.__customFileSize
      ? this.helperFileService.convertToBytes(this.request.__customFileSize)
      : this.configService.get<number>('file.video.maxFileSize');

    if (size > maxSizeInBytes) {
      throw new PayloadTooLargeException({
        statusCode: EnumFileStatusCodeError.FileMaxSizeError,
        message: 'file.error.maxSize',
      });
    }
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileSizeAudioPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {}

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.size);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.size);

    return value;
  }

  async validate(size: number): Promise<void> {
    const maxSizeInBytes = this.request.__customFileSize
      ? this.helperFileService.convertToBytes(this.request.__customFileSize)
      : this.configService.get<number>('file.audio.maxFileSize');

    if (size > maxSizeInBytes) {
      throw new PayloadTooLargeException({
        statusCode: EnumFileStatusCodeError.FileMaxSizeError,
        message: 'file.error.maxSize',
      });
    }
  }
}

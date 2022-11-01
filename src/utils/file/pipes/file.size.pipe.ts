import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { HelperFileService } from '@/utils/helper/service';

import { IFile } from '../type';

import { fileSizeValidate } from './utils';

@Injectable({ scope: Scope.REQUEST })
export class FileSizeImagePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {}

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    const maxSizeInBytes = this.request.__customFileSize
      ? this.helperFileService.convertToBytes(this.request.__customFileSize)
      : this.configService.get<number>('file.image.maxFileSize');

    return await fileSizeValidate({
      maxSizeInBytes,
      value,
    });
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
    const maxSizeInBytes = this.request.__customFileSize
      ? this.helperFileService.convertToBytes(this.request.__customFileSize)
      : this.configService.get<number>('file.excel.maxFileSize');

    return await fileSizeValidate({
      value,
      maxSizeInBytes,
    });
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileSizeVideoPipe implements PipeTransform {
  constructor(
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
    @Inject(REQUEST)
    private readonly request: Request & { __customFileSize: string },
  ) {}

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    const maxSizeInBytes = this.request.__customFileSize
      ? this.helperFileService.convertToBytes(this.request.__customFileSize)
      : this.configService.get<number>('file.video.maxFileSize');

    return await fileSizeValidate({
      maxSizeInBytes,
      value,
    });
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileSizeAudioPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customFileSize: string },
    private readonly helperFileService: HelperFileService,
    private readonly configService: ConfigService,
  ) {}

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    const maxSizeInBytes = this.request.__customFileSize
      ? this.helperFileService.convertToBytes(this.request.__customFileSize)
      : this.configService.get<number>('file.audio.maxFileSize');

    return await fileSizeValidate({
      value,
      maxSizeInBytes,
    });
  }
}

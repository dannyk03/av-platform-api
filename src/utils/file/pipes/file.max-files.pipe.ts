// only for multiple upload
import {
  Inject,
  Injectable,
  PipeTransform,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { EnumFileStatusCodeError } from '@avo/type';

import { IFile } from '../type';

import { maxFilesValidate } from './utils';

@Injectable({ scope: Scope.REQUEST })
export class FileMaxFilesImagePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFiles: number },
    private readonly configService: ConfigService,
  ) {}

  async transform(value: IFile[]): Promise<IFile[]> {
    const maxFiles =
      this.request.__customMaxFiles ||
      this.configService.get<number>('file.image.maxFiles');

    return await maxFilesValidate({
      maxFiles,
      value,
    });
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileMaxFilesExcelPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFiles: number },
    private readonly configService: ConfigService,
  ) {}

  async transform(value: IFile[]): Promise<IFile[]> {
    const maxFiles =
      this.request.__customMaxFiles ||
      this.configService.get<number>('file.excel.maxFiles');

    return await maxFilesValidate({
      maxFiles,
      value,
    });
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileMaxFilesVideoPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFiles: number },
    private readonly configService: ConfigService,
  ) {}

  async transform(value: IFile[]): Promise<IFile[]> {
    const maxFiles =
      this.request.__customMaxFiles ||
      this.configService.get<number>('file.video.maxFiles');

    return await maxFilesValidate({
      maxFiles,
      value,
    });
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileMaxFilesAudioPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFiles: number },
    private readonly configService: ConfigService,
  ) {}

  async transform(value: IFile[]): Promise<IFile[]> {
    const maxFiles =
      this.request.__customMaxFiles ||
      this.configService.get<number>('file.audio.maxFiles');

    return await maxFilesValidate({
      maxFiles,
      value,
    });
  }
}

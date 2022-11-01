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

@Injectable({ scope: Scope.REQUEST })
export class FileMaxFilesImagePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFiles: number },
    private readonly configService: ConfigService,
  ) {}

  async transform(value: IFile[]): Promise<IFile[]> {
    if (!value) {
      return;
    }

    await this.validate(value);

    return value;
  }

  async validate(value: IFile[]): Promise<void> {
    const maxFiles =
      this.request.__customMaxFiles ||
      this.configService.get<number>('file.image.maxFiles');

    if (value.length > maxFiles) {
      throw new UnprocessableEntityException({
        statusCode: EnumFileStatusCodeError.FileMaxFilesError,
        message: 'file.error.maxFiles',
      });
    }
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
    await this.validate(value);

    return value;
  }

  async validate(value: IFile[]): Promise<void> {
    const maxFiles =
      this.request.__customMaxFiles ||
      this.configService.get<number>('file.excel.maxFiles');

    if (value.length > maxFiles) {
      throw new UnprocessableEntityException({
        statusCode: EnumFileStatusCodeError.FileMaxFilesError,
        message: 'file.error.maxFiles',
      });
    }
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
    await this.validate(value);

    return value;
  }

  async validate(value: IFile[]): Promise<void> {
    const maxFiles =
      this.request.__customMaxFiles ||
      this.configService.get<number>('file.video.maxFiles');

    if (value.length > maxFiles) {
      throw new UnprocessableEntityException({
        statusCode: EnumFileStatusCodeError.FileMaxFilesError,
        message: 'file.error.maxFiles',
      });
    }
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
    await this.validate(value);

    return value;
  }

  async validate(value: IFile[]): Promise<void> {
    const maxFiles =
      this.request.__customMaxFiles ||
      this.configService.get<number>('file.audio.maxFiles');

    if (value.length > maxFiles) {
      throw new UnprocessableEntityException({
        statusCode: EnumFileStatusCodeError.FileMaxFilesError,
        message: 'file.error.maxFiles',
      });
    }
  }
}

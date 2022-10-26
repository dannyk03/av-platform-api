import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

import { EnumFileStatusCodeError } from '@avo/type';

import { IFile } from '../type';

@Injectable()
export class FileRequiredPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    await this.validate(value);

    return value;
  }

  async validate(value: IFile | IFile[]): Promise<void> {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new UnprocessableEntityException({
        statusCode: EnumFileStatusCodeError.FileNeededError,
        message: 'file.error.notFound',
      });
    }

    return;
  }
}

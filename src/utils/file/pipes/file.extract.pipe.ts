import {
  Injectable,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import { EnumFileExcelMime, EnumFileStatusCodeError } from '@avo/type';

import { HelperFileService } from '@/utils/helper/service';

import { IFile, IFileExtract } from '../type';

// only for excel
@Injectable()
export class FileExtractPipe implements PipeTransform {
  constructor(private readonly helperFileService: HelperFileService) {}

  async transform(
    value: IFile | IFile[],
  ): Promise<IFileExtract | IFileExtract[]> {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      const extracts: IFileExtract[] = [];

      for (const val of value) {
        await this.validate(val.mimetype);

        const extract: IFileExtract = await this.extract(val);
        extracts.push(extract);
      }

      return extracts;
    }

    const file: IFile = value as IFile;
    await this.validate(file.mimetype);

    return this.extract(file);
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
  }

  async extract(value: IFile): Promise<IFileExtract> {
    const extract = this.helperFileService.readExcel(value.buffer);

    return {
      ...value,
      extract,
    };
  }
}

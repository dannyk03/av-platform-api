// only for excel
import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import { EnumFileExcelMime, EnumFileStatusCodeError } from '@avo/type';

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

import { IFileExtract } from '../type';
import { IValidationErrorImport } from '@/utils/error/type';

// must use after FileExtractPipe
@Injectable()
export class FileValidationPipe<T> implements PipeTransform {
  constructor(private readonly dto: ClassConstructor<T>) {}

  async transform(
    value: IFileExtract<T> | IFileExtract<T>[],
  ): Promise<IFileExtract<T> | IFileExtract<T>[]> {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      const classTransforms: IFileExtract<T>[] = [];
      for (const val of value) {
        await this.validate(val);

        const classTransform: T[] = await this.transformExtract(
          this.dto,
          val.extract,
        );

        await this.validateExtract(classTransform, val.filename);

        const classTransformMerge: IFileExtract<T> = await this.transformMerge(
          val,
          classTransform,
        );
        classTransforms.push(classTransformMerge);
      }

      return classTransforms;
    }

    await this.validate(value);

    const classTransform: T[] = await this.transformExtract(
      this.dto,
      value.extract,
    );

    await this.validateExtract(classTransform, value.filename);

    return this.transformMerge(value, classTransform);
  }

  async transformMerge(
    value: IFileExtract,
    classTransform: T[],
  ): Promise<IFileExtract<T>> {
    return {
      ...value,
      dto: classTransform,
    };
  }

  async transformExtract(
    classDtos: ClassConstructor<T>,
    extract: Record<string, any>[],
  ): Promise<T[]> {
    return plainToInstance(classDtos, extract);
  }

  async validate(value: IFileExtract): Promise<void> {
    if (
      !Object.values(EnumFileExcelMime).find(
        (val) => val === value.mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: EnumFileStatusCodeError.FileExtensionError,
        message: 'file.error.mimeInvalid',
      });
    } else if (!value.extract) {
      throw new UnprocessableEntityException({
        statusCode: EnumFileStatusCodeError.FileNeedExtractFirstError,
        message: 'file.error.needExtractFirst',
      });
    }
  }

  async validateExtract(classTransform: T[], filename: string): Promise<void> {
    const errors: IValidationErrorImport[] = [];
    for (const [index, clsTransform] of classTransform.entries()) {
      const validator: ValidationError[] = await validate(
        clsTransform as Record<string, any>,
      );
      if (validator.length > 0) {
        errors.push({
          row: index,
          file: filename,
          errors: validator,
        });
      }
    }

    if (errors.length > 0) {
      throw new UnprocessableEntityException({
        statusCode: EnumFileStatusCodeError.FileValidationDtoError,
        message: 'file.error.validationDto',
        errors,
        errorType: 'import',
      });
    }
  }
}

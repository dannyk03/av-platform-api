import { applyDecorators } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';

import { Transform } from 'class-transformer';

import { ITransformOptions } from './transform.interface';

export function ToLowerCaseTransform(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Transform(({ value }) =>
      each && Array.isArray(value)
        ? value.map((v) => v?.toLowerCase())
        : isString(value)
        ? value?.toLowerCase()
        : value,
    ),
  );
}

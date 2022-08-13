import { applyDecorators } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';

import { Expose, Transform } from 'class-transformer';
import trim from 'validator/lib/trim';

import { ITransformOptions } from './transform.interface';

export function TrimTransform(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    Transform(({ value }) =>
      each && Array.isArray(value)
        ? value.map((v) => (isString(v) ? trim(v) : v))
        : isString(value)
        ? trim(value)
        : value,
    ),
  );
}

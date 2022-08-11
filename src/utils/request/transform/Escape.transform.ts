import { applyDecorators } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';

import { Expose, Transform } from 'class-transformer';
import escape from 'validator/lib/escape';

import { ITransformOptions } from './transform.interface';

export function Escape(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    Transform(({ value }) =>
      each && Array.isArray(value)
        ? value.map((v) => (isString(v) ? escape(v) : v))
        : isString(value)
        ? escape(value)
        : value,
    ),
  );
}

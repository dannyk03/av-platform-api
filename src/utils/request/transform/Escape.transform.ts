import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import escape from 'validator/lib/escape';

import { ITransformOptions } from './transform.interface';

export function Escape(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    Transform(({ value }) =>
      each && Array.isArray(value)
        ? value.map((v) => escape(v))
        : escape(value),
    ),
  );
}

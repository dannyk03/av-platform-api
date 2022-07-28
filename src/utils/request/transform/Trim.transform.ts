import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import trim from 'validator/lib/trim';

import { ITransformOptions } from './transform.interface';

export function Trim(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    Transform(({ value }) =>
      each && Array.isArray(value) ? value.map((v) => trim(v)) : trim(value),
    ),
  );
}

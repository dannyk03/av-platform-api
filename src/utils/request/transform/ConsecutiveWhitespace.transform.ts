import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { isString } from 'class-validator';

import { ITransformOptions } from './transform.interface';

const consecutiveWhitespaceFunc = (input: string) =>
  input?.replace?.(/\s+/g, ' ');

export function ConsecutiveWhitespaceTransform(
  options?: ITransformOptions,
): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    Transform(({ value }) =>
      each && Array.isArray(value)
        ? value.map((v) => (isString(v) ? consecutiveWhitespaceFunc(v) : v))
        : isString(value)
        ? consecutiveWhitespaceFunc(value)
        : value,
    ),
  );
}

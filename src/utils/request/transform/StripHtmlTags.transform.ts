import { applyDecorators } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';

import { Expose, Transform } from 'class-transformer';
import striptags from 'striptags';

import { ITransformOptions } from './transform.interface';

export function StripHtmlTagsTransform(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    Transform(({ value }) =>
      each && Array.isArray(value)
        ? value.map((v) => (isString(v) ? striptags(v) : v))
        : isString(value)
        ? striptags(value)
        : value,
    ),
  );
}

import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { IsString, isString } from 'class-validator';

import { ITransformOptions } from './transform.interface';

import { Trim } from './Trim.transform';

export function StringToNumberTransform(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    IsString({ each }),
    Trim({ each }),
    Transform(({ value }) => (isString(value) ? Number(value) : value)),
  );
}

import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { IsString, isString } from 'class-validator';

import { TrimTransform } from './Trim.transform';
import { ITransformOptions } from './transform.interface';

export function StringToNumberTransform(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    IsString({ each }),
    TrimTransform({ each }),
    Transform(({ value }) => (isString(value) ? Number(value) : value)),
  );
}

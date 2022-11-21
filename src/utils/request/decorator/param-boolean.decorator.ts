import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export function ParamBoolean(defaultValue: boolean): any {
  return applyDecorators(
    Expose(),
    IsBoolean(),
    Transform(({ value }) =>
      value && ['true', 'false'].includes(value)
        ? value === 'true'
        : defaultValue,
    ),
  );
}

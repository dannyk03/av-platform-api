import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';
import { isString } from 'class-validator';

export function BooleanStringTransform(): any {
  return applyDecorators(
    Transform(({ value }) =>
      isString(value)
        ? value === 'true'
          ? true
          : value === 'false'
          ? false
          : value
        : value,
    ),
  );
}

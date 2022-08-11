import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';
import { isString } from 'class-validator';

export function ArrayTransform(): any {
  return applyDecorators(
    Transform(({ value }) => {
      if (isString(value)) {
        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      }
      return value;
    }),
  );
}

import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';

export function BooleanStringTransform(): any {
  return applyDecorators(
    Transform(({ value }) => {
      switch (String(value)?.toLowerCase()) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return value;
      }
    }),
  );
}

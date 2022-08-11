import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';

export function UniqueArray(): any {
  return applyDecorators(
    Transform(({ value }) =>
      Array.isArray(value) ? [...new Set(value)] : value,
    ),
  );
}

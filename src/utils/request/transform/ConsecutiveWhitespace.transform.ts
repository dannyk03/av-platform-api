import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';

export function ConsecutiveWhitespaceTransform(): any {
  return applyDecorators(
    Transform(({ value }) => value?.replace?.(/\s+/g, ' ')),
  );
}

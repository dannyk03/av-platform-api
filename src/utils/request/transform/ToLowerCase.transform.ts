import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';

export function ToLowerCaseTransform(): any {
  return applyDecorators(Transform(({ value }) => value?.toLowerCase()));
}

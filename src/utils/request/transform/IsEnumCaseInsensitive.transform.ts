import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { capitalize } from 'lodash';

export function IsEnumCaseInsensitiveTransform(
  defaultEnum: Record<string, any>,
): any {
  const cEnum = defaultEnum as unknown;
  return applyDecorators(
    Expose(),
    IsEnum(cEnum as object, { each: true }),
    Transform(({ value }) => defaultEnum[capitalize(value)] || value),
  );
}

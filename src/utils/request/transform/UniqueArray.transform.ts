import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';
import uniqBy from 'lodash/uniqBy';

export function UniqueArrayByTransform(field?: string): any {
  return applyDecorators(
    Transform(({ value }) =>
      Array.isArray(value)
        ? field
          ? uniqBy(value, field)
          : [...new Set(value)]
        : value,
    ),
  );
}

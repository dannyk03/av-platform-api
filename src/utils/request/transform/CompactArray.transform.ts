import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';
import compact from 'lodash/compact';

export function CompactArrayTransform(): any {
  return applyDecorators(
    Transform(({ value }) => (Array.isArray(value) ? compact(value) : value)),
  );
}

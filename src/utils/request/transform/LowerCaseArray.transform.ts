import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { isString } from 'class-validator';

export function LowerCaseArray(): any {
  return applyDecorators(
    Expose(),
    Transform(({ value }) =>
      value?.map?.((item: string) =>
        isString(item) ? item.toLowerCase() : item,
      ),
    ),
  );
}

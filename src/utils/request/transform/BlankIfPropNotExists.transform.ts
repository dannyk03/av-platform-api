import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';

export function BlankIfPropNotExistsTransform(prop: string): any {
  return applyDecorators(
    Expose(),
    Transform(({ obj, value }) => {
      return value && !obj[prop] ? undefined : value;
    }),
  );
}

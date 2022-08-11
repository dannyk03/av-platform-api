import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';
import { isString } from 'class-validator';
import isEmpty from 'lodash/isEmpty';

export function EmptyStringToUndefinedTransform(): any {
  return applyDecorators(
    Transform(({ value }) =>
      isString(value) ? (!isEmpty(value) ? value : undefined) : value,
    ),
  );
}

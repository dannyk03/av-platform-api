import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export function EmptyStringToUndefinedTransform(): any {
  return applyDecorators(
    Transform(({ value }) =>
      isString(value) ? (!isEmpty(value) ? value : undefined) : value,
    ),
  );
}

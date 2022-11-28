import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';
import { isString } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';

export function ParsePhoneNumberFromStringTransform(): any {
  return applyDecorators(
    Transform(({ value }) => {
      if (isString(value)) {
        return parsePhoneNumberFromString(value)?.number;
      }
      return value;
    }),
  );
}

import { applyDecorators } from '@nestjs/common';

import { Expose } from 'class-transformer';

import { ParsePhoneNumberFromStringTransform } from '../transform';
import { IsPhoneNumber } from '../validation';

export function PhoneNumber(): any {
  return applyDecorators(
    Expose(),
    ParsePhoneNumberFromStringTransform(),
    IsPhoneNumber(),
  );
}

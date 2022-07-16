import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js/types';
import get from 'lodash/get';
import set from 'lodash/set';
// Services
import { HelperPhoneNumberService } from '@/utils/helper/service';
//

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  constructor(
    protected readonly helperPhoneNumberService: HelperPhoneNumberService,
  ) {}

  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = args.object[relatedPropertyName];

    return (
      typeof value === 'string' &&
      this.helperPhoneNumberService.isValidPhoneNumber(
        value,
        relatedValue as CountryCode,
      )
    );
  }
}

export function IsPhoneNumber(
  property?,
  validationOptions: ValidationOptions = {},
) {
  return function (object: Record<string, any>, propertyName: string): any {
    if (!get(validationOptions, 'message')) {
      const defaultValidationFailedMessage = `$property must be valid phone number '$value'.`;
      set(validationOptions, 'message', defaultValidationFailedMessage);
    }
    registerDecorator({
      name: 'IsPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsPhoneNumberConstraint,
    });
  };
}

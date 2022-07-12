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
import { HelperMobileNumberService } from '@/utils/helper/service/helper.mobile-number.service';
//

@ValidatorConstraint({ async: true })
@Injectable()
export class IsMobileNumberConstraint implements ValidatorConstraintInterface {
  constructor(
    protected readonly helperMobileNumberService: HelperMobileNumberService,
  ) {}

  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = args.object[relatedPropertyName];

    return (
      typeof value === 'string' &&
      this.helperMobileNumberService.isValidPhoneNumber(
        value,
        relatedValue as CountryCode,
      )
    );
  }
}

export function IsMobileNumber(
  property?,
  validationOptions: ValidationOptions = {},
) {
  return function (object: Record<string, any>, propertyName: string): any {
    if (!get(validationOptions, 'message')) {
      const defaultValidationFailedMessage = `$property must be valid phone number '$value'.`;
      set(validationOptions, 'message', defaultValidationFailedMessage);
    }
    registerDecorator({
      name: 'IsMobileNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsMobileNumberConstraint,
    });
  };
}

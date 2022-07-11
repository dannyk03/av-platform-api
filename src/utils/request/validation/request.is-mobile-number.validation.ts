import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
// Services
import { HelperMobileNumberService } from '@/utils/helper/service/helper.mobile-number.service';
import { CountryCode } from 'libphonenumber-js/types';
//

@ValidatorConstraint({ async: true })
@Injectable()
export class IsMobileNumberConstraint implements ValidatorConstraintInterface {
  constructor(
    protected readonly helperMobileNumberService: HelperMobileNumberService,
  ) {}

  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as Record<string, unknown>)[
      relatedPropertyName
    ];

    return typeof value === 'string' && relatedPropertyName
      ? typeof relatedValue === 'string'
      : true &&
          this.helperMobileNumberService.isValidPhoneNumber(
            value,
            relatedValue as CountryCode,
          );
  }
}

export function IsMobileNumber(
  property?,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): any {
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

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isString,
  registerDecorator,
} from 'class-validator';

import { HelperPhoneNumberService } from '@/utils/helper/service';

import { CountryCode } from 'libphonenumber-js/types';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  constructor(
    protected readonly helperPhoneNumberService: HelperPhoneNumberService,
    protected readonly configService: ConfigService,
  ) {}

  validate(value: string, args: ValidationArguments) {
    const [countryCodeProperty] = args.constraints;
    const relatedValue = args.object[countryCodeProperty];

    return (
      isString(value) &&
      this.helperPhoneNumberService.isValidPhoneNumber(
        value,
        relatedValue as CountryCode,
      )
    );
  }

  defaultMessage(): string {
    return `$property must be valid phone number '$value'`;
  }
}

export function IsPhoneNumber(
  {
    countryCodeProperty,
    validationOptions,
  }: {
    countryCodeProperty?: string;
    validationOptions?: ValidationOptions;
  } = {
    countryCodeProperty: undefined,
    validationOptions: undefined,
  },
) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [countryCodeProperty],
      validator: IsPhoneNumberConstraint,
    });
  };
}

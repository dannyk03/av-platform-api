import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnumAppEnv } from '@avo/type';

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import get from 'lodash/get';
import set from 'lodash/set';

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
    const [countryCodeProperty, allowEmptyForEnvs] = args.constraints;
    const relatedValue = args.object[countryCodeProperty];

    if (
      allowEmptyForEnvs?.includes(this.configService.get<string>('app.env')) &&
      (value === '' || value === null || value === undefined)
    ) {
      return true;
    }

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
  {
    allowEmptyForEnvs = [],
    countryCodeProperty,
    validationOptions,
  }: {
    allowEmptyForEnvs?: EnumAppEnv[];
    countryCodeProperty?: string;
    validationOptions?: ValidationOptions;
  } = {
    allowEmptyForEnvs: [],
    countryCodeProperty: undefined,
    validationOptions: undefined,
  },
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
      constraints: [countryCodeProperty, allowEmptyForEnvs],
      validator: IsPhoneNumberConstraint,
    });
  };
}

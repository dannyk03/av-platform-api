import { Injectable } from '@nestjs/common';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidMonthConstraint implements ValidatorConstraintInterface {
  validate(inputValue: string): boolean {
    const value = Number(inputValue);

    return value >= 1 && value <= 12;
  }
}

export function IsValidMonth(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsValidMonth',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidMonthConstraint,
    });
  };
}

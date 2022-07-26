import { HelperNumberService } from '$/utils/helper/service';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsOnlyDigitsConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly helperNumberService: HelperNumberService) {}

  validate(value: string): boolean {
    return value ? this.helperNumberService.check(value) : false;
  }
}

export function IsOnlyDigits(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsOnlyDigits',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOnlyDigitsConstraint,
    });
  };
}

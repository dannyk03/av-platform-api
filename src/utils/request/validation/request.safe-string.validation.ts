import { Injectable } from '@nestjs/common';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { HelperStringService } from '@/utils/helper/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class SafeStringConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly helperStringService: HelperStringService) {}

  validate(value: string): boolean {
    return value ? this.helperStringService.checkSafeString(value) : false;
  }
}

export function SafeString(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'SafeString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: SafeStringConstraint,
    });
  };
}

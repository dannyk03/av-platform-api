import { Injectable } from '@nestjs/common';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class RangeTupleConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return value[0] <= value[1];
  }
}

export function RangeTuple(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'RangeTuple',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: RangeTupleConstraint,
    });
  };
}

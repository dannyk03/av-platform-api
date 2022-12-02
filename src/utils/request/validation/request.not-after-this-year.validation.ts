import { Injectable } from '@nestjs/common';

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import dayjs from 'dayjs';

@ValidatorConstraint({ async: true })
@Injectable()
export class NotAfterThisYearConstraint
  implements ValidatorConstraintInterface
{
  validate(inputValue: string, args: ValidationArguments): boolean {
    const [year] = args.constraints;
    const yearObj = dayjs(`${inputValue}-01-01`);

    if (!yearObj.isValid()) {
      return false;
    }

    const targetYearObj = dayjs(`${year}-01-01`);
    return yearObj <= targetYearObj;
  }

  defaultMessage(): string {
    return 'Invalid year';
  }
}

export function NotAfterThisYear(
  year: string | number = new Date().getFullYear().toString(),
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'NotAfterThisYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [year],
      validator: NotAfterThisYearConstraint,
    });
  };
}

import { Injectable } from '@nestjs/common';

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import moment from 'moment';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidDayOfMonthConstraint
  implements ValidatorConstraintInterface
{
  validate(inputValue: string, args: ValidationArguments): boolean {
    const value = Number(inputValue);
    const [propertyMonth, propertyYear] = args.constraints;
    const relatedValueMonth =
      propertyMonth && Number(args.object[propertyMonth]);
    const relatedValueYear = propertyYear && Number(args.object[propertyYear]);

    if (value && relatedValueMonth && relatedValueYear) {
      return moment(
        `${relatedValueYear}-${relatedValueMonth}-${value}`,
        'YYYY-MM-DD',
      ).isValid();
    } else if (value === 29 && relatedValueMonth === 2 && !relatedValueYear) {
      return true;
    } else if (!relatedValueYear) {
      return moment(
        `${new Date().getFullYear()}-${relatedValueMonth}-${value}`,
        'YYYY-MM-DD',
      ).isValid();
    }

    return true;
  }
}

export function IsValidDayOfMonth(
  propertyMonth: string,
  propertyYear?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsValidDayOfMonth',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [propertyMonth, propertyYear],
      validator: IsValidDayOfMonthConstraint,
    });
  };
}

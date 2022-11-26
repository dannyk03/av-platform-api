import { Injectable } from '@nestjs/common';

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { HelperEmailService } from '@/utils/helper/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsAcceptableEmailConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly helperEmailService: HelperEmailService) {}

  defaultMessage(): string {
    return 'Not acceptable email domain';
  }

  validate(value: string): boolean {
    return this.helperEmailService.isAcceptableEmail(value);
  }
}

export function IsIsAcceptableEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsIsAcceptableEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsAcceptableEmailConstraint,
    });
  };
}

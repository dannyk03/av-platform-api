import { Injectable } from '@nestjs/common';

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { UserService } from '@/user/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsRegisteredUserConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { property, constraints } = args;
    const [column] = constraints;

    const checkUser = await this.userService.checkExist({
      [column || property]: value,
    });

    return checkUser[column || property];
  }
}

export function IsRegisteredUser(
  column?: 'email' | 'phoneNumber',
  validationOptions?: ValidationOptions,
  silent = false,
) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsRegisteredUser',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [column, silent],
      validator: IsRegisteredUserConstraint,
    });
  };
}

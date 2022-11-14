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

@ValidatorConstraint({ async: true })
@Injectable()
export class IsNotEmptyForEnvConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly configService: ConfigService) {}

  validate(value: any, args: ValidationArguments): boolean {
    const [envs] = args.constraints;
    const env = this.configService.get<string>('app.env');

    if (envs.includes(env)) {
      return value !== '' && value !== null && value !== undefined;
    }

    return true;
  }
}

export function IsNotEmptyForEnv(
  envs: EnumAppEnv[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsNotEmptyForEnv',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [envs],
      validator: IsNotEmptyForEnvConstraint,
    });
  };
}

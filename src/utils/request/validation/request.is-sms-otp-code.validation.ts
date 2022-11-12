import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { HelperNumberService } from '@/utils/helper/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsSmsOtpCodeConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly helperNumberService: HelperNumberService,
    private readonly configService: ConfigService,
  ) {}

  validate(value: string): boolean {
    return (
      this.helperNumberService.check(value) &&
      value.length ===
        this.configService.get<number>('twilio.service.verify.otp.codeLength')
    );
  }
}

export function IsSmsOtpCode(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsSmsOtpCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSmsOtpCodeConstraint,
    });
  };
}

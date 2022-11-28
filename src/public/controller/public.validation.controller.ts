import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { PublicEmailValidateDto, PublicPhoneNumberValidateDto } from '../dto';

@Throttle(2, 1)
@Controller({
  version: '1',
  path: 'validation',
})
export class PublicValidationController {
  @Get('/email')
  async validateEmail(
    @Query()
    { value: email }: PublicEmailValidateDto,
  ) {
    return email;
  }

  @Get('/phone')
  async validatePhoneNumber(
    @Query()
    { value: phoneNumber }: PublicPhoneNumberValidateDto,
  ) {
    return phoneNumber;
  }
}

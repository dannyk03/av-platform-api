import { Injectable } from '@nestjs/common';

import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js/mobile';

@Injectable()
export class HelperPhoneNumberService {
  public isValidPhoneNumber(
    phoneNumber: string,
    countryCode?: CountryCode,
  ): boolean {
    return (
      typeof phoneNumber === 'string' &&
      isValidPhoneNumber(phoneNumber, countryCode)
    );
  }
}

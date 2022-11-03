import { Injectable } from '@nestjs/common';

import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js/mobile';

import { IHelperMobileNumberService } from '../type/helper.mobile-number.interface';

@Injectable()
export class HelperPhoneNumberService implements IHelperMobileNumberService {
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

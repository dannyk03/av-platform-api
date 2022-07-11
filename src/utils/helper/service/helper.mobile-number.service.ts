import { Injectable } from '@nestjs/common';
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

@Injectable()
export class HelperMobileNumberService {
  public isValidPhoneNumber(
    mobileNumber: string,
    countryCode?: CountryCode,
  ): boolean {
    return (
      typeof mobileNumber === 'string' &&
      isValidPhoneNumber(mobileNumber, countryCode)
    );
  }
}

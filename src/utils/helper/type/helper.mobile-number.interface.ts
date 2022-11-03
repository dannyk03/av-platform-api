import { CountryCode } from 'libphonenumber-js/mobile';

export interface IHelperMobileNumberService {
  isValidPhoneNumber(phoneNumber: string, countryCode?: CountryCode): boolean;
}

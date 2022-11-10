// Used for injecting the Twilio client
export const TWILIO_TOKEN = 'TwilioToken';
export const TWILIO_MODULE_OPTIONS = 'TwilioModuleOptions';

export enum EnumTwilioVerificationCheckStatus {
  Pending = 'pending',
  Approved = 'approved',
  Canceled = 'canceled',
}

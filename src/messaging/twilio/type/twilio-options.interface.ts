import { TwilioClientOptions } from 'twilio/lib/rest/Twilio';

export interface TwilioOptions extends TwilioClientOptions {
  readonly apiKey: string;
  readonly apiSecretKey: string;
}

import { TwilioClientOptions } from 'twilio/lib/rest/Twilio';

export interface TwilioOptions extends TwilioClientOptions {
  readonly accountSid: string;
  readonly authToken: string;
}

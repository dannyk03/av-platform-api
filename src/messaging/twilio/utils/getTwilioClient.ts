import { Twilio } from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';

import { TwilioOptions } from '../type';

export function getTwilioClient({
  apiKey,
  apiSecretKey,
  ...options
}: TwilioOptions): TwilioClient {
  return new Twilio(apiKey, apiSecretKey, options);
}

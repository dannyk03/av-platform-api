import Twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';

import { TwilioOptions } from '../type';

export function getTwilioClient({
  accountSid,
  authToken,
  ...options
}: TwilioOptions): TwilioClient {
  return Twilio(accountSid, authToken, options);
}

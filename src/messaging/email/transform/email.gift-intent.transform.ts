import { Exclude, Expose, Type } from 'class-transformer';

import { EmailPayloadRecipient } from './email.recipient.transform';
import { EmailPayloadSender } from './email.sender.transform';

@Exclude()
export class EmailPayloadGiftIntent {
  @Expose()
  @Type(() => EmailPayloadRecipient)
  recipient: EmailPayloadRecipient;

  @Expose()
  @Type(() => EmailPayloadSender)
  sender: EmailPayloadSender;
}

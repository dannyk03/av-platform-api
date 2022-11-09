import { Exclude, Expose, Type } from 'class-transformer';

import { EmailTemplate } from '../constant';

import { EmailPayloadRecipient } from './email.recipient.transform';
import { EmailPayloadSender } from './email.sender.transform';

@Exclude()
export class EmailPayloadTheParticipatingParties {
  @Expose({
    groups: [
      EmailTemplate.SendSenderGiftDelivered,
      EmailTemplate.SendRecipientGiftDelivered,
      EmailTemplate.SendGiftSelection,
      EmailTemplate.SendSenderGiftIsOnItsWay,
    ],
  })
  @Type(() => EmailPayloadRecipient)
  recipient: EmailPayloadRecipient;

  @Expose({
    groups: [
      EmailTemplate.SendSenderGiftDelivered,
      EmailTemplate.SendRecipientGiftDelivered,
      EmailTemplate.SendGiftSelection,
      EmailTemplate.SendSenderGiftIsOnItsWay,
    ],
  })
  @Type(() => EmailPayloadSender)
  sender: EmailPayloadSender;
}

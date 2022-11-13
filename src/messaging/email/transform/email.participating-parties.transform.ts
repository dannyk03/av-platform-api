import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

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
  @Transform(
    ({ obj }) => {
      return plainToInstance(EmailPayloadRecipient, obj.recipient);
    },
    {
      groups: [
        EmailTemplate.SendSenderGiftDelivered,
        EmailTemplate.SendRecipientGiftDelivered,
        EmailTemplate.SendGiftSelection,
        EmailTemplate.SendSenderGiftIsOnItsWay,
      ],
    },
  )
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
  @Transform(({ obj }) => plainToInstance(EmailPayloadSender, obj.sender), {
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

import { Exclude, Expose, Transform } from 'class-transformer';

import { EmailTemplate } from '../constant';

@Exclude()
export class EmailPayloadRecipient {
  @Expose({
    groups: [
      EmailTemplate.SendSenderGiftDelivered,
      EmailTemplate.SendRecipientGiftDelivered,
      EmailTemplate.SendGiftSelection,
      EmailTemplate.SendSenderGiftIsOnItsWay,
    ],
  })
  @Transform(({ obj: recipient }) => recipient.user?.profile?.firstName, {
    groups: [
      EmailTemplate.SendSenderGiftDelivered,
      EmailTemplate.SendRecipientGiftDelivered,
      EmailTemplate.SendGiftSelection,
      EmailTemplate.SendSenderGiftIsOnItsWay,
    ],
  })
  readonly firstName: string;
}

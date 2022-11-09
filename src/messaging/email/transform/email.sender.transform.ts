import { Exclude, Expose, Transform } from 'class-transformer';

import { EmailTemplate } from '../constant';

@Exclude()
export class EmailPayloadSender {
  @Expose({
    groups: [
      EmailTemplate.SendSenderGiftDelivered,
      EmailTemplate.SendRecipientGiftDelivered,
      EmailTemplate.SendGiftSelection,
      EmailTemplate.SendSenderGiftIsOnItsWay,
    ],
  })
  @Transform(({ obj: sender }) => sender.user?.profile?.firstName, {
    groups: [
      EmailTemplate.SendSenderGiftDelivered,
      EmailTemplate.SendRecipientGiftDelivered,
      EmailTemplate.SendGiftSelection,
      EmailTemplate.SendSenderGiftIsOnItsWay,
    ],
  })
  readonly firstName: string;
}

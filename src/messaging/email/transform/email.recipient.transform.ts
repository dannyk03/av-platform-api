import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

import { EnumEmailPayloadGroup } from '../constant';

import { EmailPayloadShipping } from './email.shipping.transform';

@Exclude()
export class EmailPayloadRecipient {
  @Expose({
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  @Transform(({ obj: recipient }) => recipient.user?.profile?.firstName, {
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  readonly firstName: string;

  @Expose({
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  @Transform(({ obj: recipient }) =>
    plainToInstance(EmailPayloadShipping, recipient.user?.profile?.shipping, {
      groups: [EnumEmailPayloadGroup.DeliveredSender],
    }),
  )
  @Type(() => EmailPayloadShipping)
  shipping: EmailPayloadShipping;
}

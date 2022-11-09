import { Exclude, Expose } from 'class-transformer';

import { EnumEmailPayloadGroup } from '../constant';

@Exclude()
export class EmailPayloadShipping {
  @Expose({
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  addressLine1: string;
  @Expose({
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  addressLine2: string;

  @Expose({
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  city: string;

  @Expose({
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  country: string;

  @Expose({
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  state: string;

  @Expose({
    groups: [EnumEmailPayloadGroup.DeliveredSender],
  })
  zipCode: string;
}

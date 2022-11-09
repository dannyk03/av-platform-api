import { Exclude, Expose, Transform } from 'class-transformer';

import { GiftShippingDetails } from '../constant';

@Exclude()
export class EmailPayloadShipping implements Omit<GiftShippingDetails, 'ETA'> {
  @Expose()
  @Transform(
    ({ obj: giftIntent }) =>
      giftIntent?.recipient?.user?.profile?.shipping?.addressLine1,
  )
  addressLine1: string;
  @Expose()
  @Transform(
    ({ obj: giftIntent }) =>
      giftIntent?.recipient?.user?.profile?.shipping?.addressLine2,
  )
  addressLine2: string;

  @Expose()
  @Transform(
    ({ obj: giftIntent }) =>
      giftIntent?.recipient?.user?.profile?.shipping?.city,
  )
  city: string;

  @Expose()
  @Transform(
    ({ obj: giftIntent }) =>
      giftIntent?.recipient?.user?.profile?.shipping?.country,
  )
  country: string;

  @Expose()
  @Transform(
    ({ obj: giftIntent }) =>
      giftIntent?.recipient?.user?.profile?.shipping?.state,
  )
  state: string;

  @Expose()
  @Transform(
    ({ obj: giftIntent }) =>
      giftIntent?.recipient?.user?.profile?.shipping?.zipCode,
  )
  zipCode: string;
}

import { EnumOccasion } from '@avo/type';

import { Exclude, Expose, Type } from 'class-transformer';

import { GiftIntentAdditionalData, GiftRecipient } from '../entity';

@Exclude()
export class GiftUserSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly phoneNumber: string;
}

@Exclude()
export class GiftIntentAdditionalDataSerialization {
  @Expose()
  readonly priceMin: number;

  @Expose()
  readonly priceMax: number;

  @Expose()
  readonly occasion: EnumOccasion;
}

@Exclude()
export class GiftUserAdditionalDataSerialization {
  @Expose()
  readonly email: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;
}
@Exclude()
export class GiftRecipientSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
export class GiftSenderSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  additionalData: GiftUserAdditionalDataSerialization;
}

export class GiftIntentSerialization {
  @Type(() => GiftRecipientSerialization)
  readonly recipient: GiftRecipientSerialization;

  @Type(() => GiftSenderSerialization)
  readonly sender: GiftSenderSerialization;

  @Type(() => GiftIntentAdditionalDataSerialization)
  readonly additionalData: GiftIntentAdditionalDataSerialization;

  @Exclude()
  readonly deletedAt: Date;
}

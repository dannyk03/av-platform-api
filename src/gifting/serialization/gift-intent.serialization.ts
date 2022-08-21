import {
  EnumOccasion,
  IGiftIntentAdditionalDataGetSerialization,
  IGiftIntentGetSerialization,
  IGiftOptionGetSerialization,
  IGiftRecipientGetSerialization,
  IGiftSenderGetSerialization,
  IGiftSubmitGetSerialization,
  IGiftSubmitGiftsGetSerialization,
  IGiftUserGetSerialization,
} from '@avo/type';

import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

import { Gift } from '../entity';
import { Product } from '@/catalog/product/entity';

import { ProductGetSerialization } from '@/catalog/product/serialization';

@Exclude()
class GiftUserSerialization implements IGiftUserGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly phoneNumber: string;
}

@Exclude()
class GiftIntentAdditionalDataSerialization
  implements IGiftIntentAdditionalDataGetSerialization
{
  @Expose()
  readonly priceMin: number;

  @Expose()
  readonly priceMax: number;

  @Expose()
  readonly occasion: EnumOccasion;
}

@Exclude()
class GiftUserAdditionalDataSerialization {
  @Expose()
  readonly email: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;
}
@Exclude()
class GiftOptionsSerialization implements IGiftOptionGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Transform(({ value: products }) =>
    products?.map((product: Product) =>
      plainToInstance(ProductGetSerialization, product),
    ),
  )
  products: ProductGetSerialization;
}
@Exclude()
class GiftSubmitGiftsSerialization implements IGiftSubmitGiftsGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Transform(({ value: products }) =>
    products?.map((product: Product) => product.id),
  )
  products: string[];
}
@Exclude()
class GiftSubmitSerialization implements IGiftSubmitGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Transform(({ value: gifts }) =>
    gifts?.map((giftOption: Gift) =>
      plainToInstance(GiftSubmitGiftsSerialization, giftOption),
    ),
  )
  readonly gifts: GiftSubmitGiftsSerialization;
}

@Exclude()
class GiftRecipientSerialization implements IGiftRecipientGetSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  readonly user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  readonly additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
class GiftSenderSerialization implements IGiftSenderGetSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
export class GiftIntentSerialization implements IGiftIntentGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Type(() => GiftRecipientSerialization)
  readonly recipient: GiftRecipientSerialization;

  @Expose()
  @Type(() => GiftSenderSerialization)
  readonly sender: GiftSenderSerialization;

  @Expose()
  @Type(() => GiftIntentAdditionalDataSerialization)
  readonly additionalData: GiftIntentAdditionalDataSerialization;

  @Expose()
  @Transform(({ value: giftOptions }) =>
    giftOptions.map((giftOption: Gift) =>
      plainToInstance(GiftOptionsSerialization, giftOption),
    ),
  )
  readonly giftOptions: GiftOptionsSerialization;

  @Expose()
  @Type(() => GiftSubmitSerialization)
  readonly giftSubmit: GiftSubmitSerialization;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly confirmedAt: Date;

  @Expose()
  readonly acceptedAt: Date;

  @Expose()
  readonly readyAt: Date;

  @Expose()
  readonly submittedAt: Date;

  @Expose()
  readonly shippedAt: Date;

  @Expose()
  readonly deliveredAt: Date;
}

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
class GiftOptionsGetSerialization implements IGiftOptionGetSerialization {
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
class GiftSubmitGiftsGetSerialization
  implements IGiftSubmitGiftsGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  @Transform(({ value: products }) =>
    products?.map((product: Product) => product.id),
  )
  products: string[];
}
@Exclude()
class GiftSubmitGetSerialization implements IGiftSubmitGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Transform(({ value: gifts }) =>
    gifts?.map((giftOption: Gift) =>
      plainToInstance(GiftSubmitGiftsGetSerialization, giftOption),
    ),
  )
  readonly gifts: GiftSubmitGiftsGetSerialization;
}

@Exclude()
class GiftRecipientGetSerialization implements IGiftRecipientGetSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  readonly user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  readonly additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
class GiftSenderGetSerialization implements IGiftSenderGetSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
export class GiftIntentGetSerialization implements IGiftIntentGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Type(() => GiftRecipientGetSerialization)
  readonly recipient: GiftRecipientGetSerialization;

  @Expose()
  @Type(() => GiftSenderGetSerialization)
  readonly sender: GiftSenderGetSerialization;

  @Expose()
  @Type(() => GiftIntentAdditionalDataSerialization)
  readonly additionalData: GiftIntentAdditionalDataSerialization;

  @Expose()
  @Transform(({ value: giftOptions }) =>
    giftOptions.map((giftOption: Gift) =>
      plainToInstance(GiftOptionsGetSerialization, giftOption),
    ),
  )
  readonly giftOptions: GiftOptionsGetSerialization;

  @Expose()
  @Type(() => GiftSubmitGetSerialization)
  readonly giftSubmit: GiftSubmitGetSerialization;

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

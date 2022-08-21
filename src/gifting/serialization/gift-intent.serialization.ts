import { EnumOccasion } from '@avo/type';

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
class GiftUserSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly phoneNumber: string;
}

@Exclude()
class GiftIntentAdditionalDataSerialization {
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
class GiftOptionsSerialization {
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
class GiftSubmitGiftsSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Transform(({ value: products }) =>
    products?.map((product: Product) => product.id),
  )
  products: string[];
}
@Exclude()
class GiftSubmitSerialization {
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
class GiftRecipientSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  readonly user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  readonly additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
class GiftSenderSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
export class GiftIntentSerialization {
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

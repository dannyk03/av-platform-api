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

import { ProductListSerialization } from '@/catalog/product/serialization';

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
class GiftOptionSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Transform(({ value: products }) =>
    products?.map((product: Product) =>
      plainToInstance(ProductListSerialization, product),
    ),
  )
  products: ProductListSerialization;
}

@Exclude()
class GiftRecipientSerialization {
  @Expose()
  @Type(() => GiftUserSerialization)
  user: GiftUserSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  additionalData: GiftUserAdditionalDataSerialization;
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

export class GiftIntentSerialization {
  @Type(() => GiftRecipientSerialization)
  readonly recipient: GiftRecipientSerialization;

  @Type(() => GiftSenderSerialization)
  readonly sender: GiftSenderSerialization;

  @Type(() => GiftIntentAdditionalDataSerialization)
  readonly additionalData: GiftIntentAdditionalDataSerialization;

  @Transform(({ value: giftOptions }) =>
    giftOptions.map((giftOption: Gift) =>
      plainToInstance(GiftOptionSerialization, giftOption),
    ),
  )
  readonly giftOptions: GiftOptionSerialization;

  @Exclude()
  readonly deletedAt: Date;
}

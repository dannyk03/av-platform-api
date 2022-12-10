import {
  EnumOccasion,
  IGiftIntentAdditionalDataGetSerialization,
  IGiftIntentGetSerialization,
  IGiftOptionGetSerialization,
  IGiftSubmitGetSerialization,
  IGiftSubmitGiftsGetSerialization,
  IGiftUserGetSerialization,
  IGiftUserRecipientGetSerialization,
  IUserProfileShippingGetSerialization,
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
import { UserProfileShippingGetSerialization } from '@/user/serialization';

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
  readonly matchReason: string | null;

  @Expose()
  @Transform(({ value: products }) =>
    products?.map(
      (product: Product): ProductGetSerialization =>
        plainToInstance(ProductGetSerialization, product),
    ),
  )
  products: ProductGetSerialization[];
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
class GiftUserGetSerialization implements IGiftUserGetSerialization {
  @Expose()
  @Transform(({ obj }) => obj.user?.id)
  id: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.email)
  readonly email: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.phoneNumber)
  readonly phoneNumber: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.profile?.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.profile?.lastName)
  readonly lastName: string;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  readonly additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
export class GiftUserRecipientGetSerialization
  extends GiftUserGetSerialization
  implements IGiftUserRecipientGetSerialization
{
  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(
      UserProfileShippingGetSerialization,
      obj?.user?.profile?.shipping,
    ),
  )
  readonly shipping: IUserProfileShippingGetSerialization;
}

@Exclude()
export class GiftIntentGetSerialization implements IGiftIntentGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  @Type(() => GiftUserRecipientGetSerialization)
  readonly recipient: GiftUserRecipientGetSerialization;

  @Expose()
  @Type(() => GiftUserGetSerialization)
  readonly sender: GiftUserGetSerialization;

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
  readonly paidAt: Date;

  @Expose()
  readonly shippedAt: Date;

  @Expose()
  readonly deliveredAt: Date;
}

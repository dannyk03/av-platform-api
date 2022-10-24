import { EnumOccasion, IUserProfileShippingGetSerialization } from '@avo/type';

import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

import { Gift } from '../entity';
import { ProductImage } from '@/catalog/product-image/entity';
import { Product } from '@/catalog/product/entity';

import { ProductImageGetSerialization } from '@/catalog/product-image/serialization';
import { UserProfileShippingGetSerialization } from '@/user/serialization';

@Exclude()
class GiftUserRecipientSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly phoneNumber: string;

  @Expose()
  @Transform(({ obj }) => obj?.profile?.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj?.profile?.lastName)
  readonly lastName: string;

  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(
      UserProfileShippingGetSerialization,
      obj?.profile?.shipping,
    ),
  )
  readonly shipping: IUserProfileShippingGetSerialization;
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
export class ProductListReadySerialization {
  @Expose()
  readonly brand: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly shippingCost: number;

  @Expose()
  @Transform(({ obj }) => obj.displayOptions?.[0]?.name)
  readonly name: string;

  @Expose()
  @Transform(({ obj }) => obj.displayOptions?.[0]?.description)
  readonly description: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.displayOptions?.[0]?.images.map((image: ProductImage) =>
      plainToInstance(ProductImageGetSerialization, image),
    ),
  )
  readonly images: ProductImageGetSerialization;
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
  readonly matchReason: string;

  @Expose()
  @Transform(({ value: products }) =>
    products?.map((product: Product) =>
      plainToInstance(ProductListReadySerialization, product),
    ),
  )
  products: ProductListReadySerialization;
}

@Exclude()
class GiftRecipientSerialization {
  @Expose()
  @Type(() => GiftUserRecipientSerialization)
  user: GiftUserRecipientSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
class GiftSenderSerialization {
  @Expose()
  @Type(() => GiftUserRecipientSerialization)
  user: GiftUserRecipientSerialization;

  @Expose()
  @Type(() => GiftUserAdditionalDataSerialization)
  additionalData: GiftUserAdditionalDataSerialization;
}

@Exclude()
export class GiftIntentReadySerialization {
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
      plainToInstance(GiftOptionSerialization, giftOption),
    ),
  )
  readonly giftOptions: GiftOptionSerialization;
}

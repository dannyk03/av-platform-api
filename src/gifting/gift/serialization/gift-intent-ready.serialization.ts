import { EnumOccasion } from '@avo/type';

import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

import { Gift } from '../entity';
import { ProductDisplayOption } from '@/catalog/product-display-option/entity';
import { ProductImage } from '@/catalog/product-image/entity';
import { Product } from '@/catalog/product/entity';

import { ProductImageListSerialization } from '@/catalog/product-image/serialization';
import {
  ProductListSerialization,
  VendorSerialization,
} from '@/catalog/product/serialization';

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
      plainToInstance(ProductImageListSerialization, image),
    ),
  )
  readonly images: ProductImageListSerialization;
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
      plainToInstance(ProductListReadySerialization, product),
    ),
  )
  products: ProductListReadySerialization;
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

@Exclude()
export class GiftIntentReadySerialization {
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

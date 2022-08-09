import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

import { ProductDisplayOption } from '@/catalog/product-display-option/entity';
import { ProductImage } from '@/catalog/product-image/entity';

import { ProductDisplayOptionListSerialization } from '@/catalog/product-display-option/serialization';
import { ProductImageListSerialization } from '@/catalog/product-image/serialization';

@Exclude()
export class VendorSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly isActive: boolean;
}

export class ProductListSerialization {
  readonly id: string;
  readonly sku: string;
  readonly brand: string;
  readonly price: number;
  readonly shippingCost: number;
  readonly taxCode: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.displayOptions[0]?.name)
  readonly name: string;

  @Expose()
  @Transform(({ obj }) => obj.displayOptions[0]?.description)
  readonly description: string;

  @Expose()
  @Transform(({ obj }) => {
    debugger;
    return obj.displayOptions[0]?.keywords;
  })
  readonly keywords!: string[];

  @Expose()
  @Transform(({ obj }) =>
    obj.displayOptions[0]?.images.map((image: ProductImage) =>
      plainToInstance(ProductImageListSerialization, image),
    ),
  )
  readonly images: ProductImageListSerialization;

  @Type(() => VendorSerialization)
  vendor: VendorSerialization;

  @Exclude()
  readonly deletedAt: Date;

  @Exclude()
  readonly displayOptions: ProductDisplayOption;
}

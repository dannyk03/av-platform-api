import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { ProductDisplayOptionListSerialization } from '@/catalog/product-display-option/serialization';

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

  @Transform(({ value }) => value?.[0])
  @Type(() => ProductDisplayOptionListSerialization)
  @Expose({ name: 'displayOptions' })
  readonly display: ProductDisplayOptionListSerialization;

  @Type(() => VendorSerialization)
  vendor: VendorSerialization;

  @Exclude()
  readonly deletedAt: Date;
}

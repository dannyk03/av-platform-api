import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { ProductDisplayOptionListSerialization } from '@/catalog/product-display-option/serialization';

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

  @Exclude()
  readonly deletedAt: Date;
}

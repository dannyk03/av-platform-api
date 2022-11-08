import {
  IProductGetSerialization,
  IProductImageGetSerialization,
  IProductVendorGetSerialization,
} from '@avo/type';

import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

import { Product } from '../entity';
import { ProductImage } from '@/catalog/product-image/entity';

import { ProductImageGetSerialization } from '@/catalog/product-image/serialization/product-image.get.serialization';

@Exclude()
export class VendorGetSerialization implements IProductVendorGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly isActive: boolean;
}

@Exclude()
export class ProductGetSerialization implements IProductGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly sku: string;

  @Expose()
  readonly brand: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly shippingCost: number;

  @Expose()
  readonly taxCode: string;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.displayOptions?.[0]?.name)
  readonly name: string;

  @Expose()
  @Transform(({ obj }) => obj.displayOptions?.[0]?.description)
  readonly description: string;

  @Expose()
  @Transform(({ obj }) => obj.displayOptions?.[0]?.keywords)
  readonly keywords!: string[];

  @Expose()
  @Transform(({ obj }: { obj: Product }): IProductImageGetSerialization[] =>
    obj.displayOptions?.[0]?.images?.map(
      (image: ProductImage): ProductImageGetSerialization =>
        plainToInstance(ProductImageGetSerialization, image),
    ),
  )
  readonly images: IProductImageGetSerialization[];

  @Expose()
  @Type(() => VendorGetSerialization)
  readonly vendor?: IProductVendorGetSerialization;

  @Expose()
  readonly vendorName: string;

  @Expose()
  readonly purchaseCost: number;

  @Expose()
  readonly shippingTimeInDays: number;
}

import { IGiftOptionGetSerialization } from '@avo/type';

import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

import { Product } from '@/catalog/product/entity';

import { ProductGetSerialization } from '@/catalog/product/serialization';

@Exclude()
export class GiftGetSerialization implements IGiftOptionGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly matchReason: string;

  @Expose()
  @Transform(({ value: products }) =>
    products?.map(
      (product: Product): ProductGetSerialization =>
        plainToInstance(ProductGetSerialization, product),
    ),
  )
  products: ProductGetSerialization[];
}

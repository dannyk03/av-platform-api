import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

import { ProductImage } from '@/catalog/product-image/entity';
import { Product } from '@/catalog/product/entity';
import { DisplayLanguage } from '@/language/display-language/entity';

import { ProductImageGetSerialization } from '@/catalog/product-image/serialization';

export class ProductDisplayOptionListSerialization {
  readonly name: string;
  readonly description: string;
  readonly keywords!: string[];

  @Transform(({ value }) => value.isoCode)
  @Expose()
  readonly language: DisplayLanguage;

  @Transform(({ value: images }) =>
    images?.map((image: ProductImage) =>
      plainToInstance(ProductImageGetSerialization, image),
    ),
  )
  readonly images: ProductImageGetSerialization;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly product: Product;

  @Exclude()
  readonly deletedAt: Date;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}

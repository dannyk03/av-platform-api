import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

import { ProductImage } from '@/catalog/product-image/entity';
import { Product } from '@/catalog/product/entity';
import { DisplayLanguage } from '@/language/display-language/entity';

import { ProductImageListSerialization } from '@/catalog/product-image/serialization';

export class ProductDisplayOptionListSerialization {
  readonly name: string;
  readonly description: string;
  readonly keywords!: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Transform(({ value }) => value.isoCode)
  @Expose()
  readonly language: DisplayLanguage;

  @Transform(({ value: images }) =>
    images.map((image: ProductImage) =>
      plainToInstance(ProductImageListSerialization, image),
    ),
  )
  readonly images: ProductImageListSerialization;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly product: Product;

  @Exclude()
  readonly deletedAt: Date;
}

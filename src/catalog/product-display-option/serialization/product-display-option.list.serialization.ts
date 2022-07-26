import { ProductImage } from '$/catalog/product-image/entity';
import { ProductImageListSerialization } from '$/catalog/product-image/serialization';
import { Product } from '$/catalog/product/entity';
import { DisplayLanguage } from '$/language/display-language/entity';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';

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

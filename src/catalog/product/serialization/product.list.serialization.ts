import { ProductDisplayOptionListSerialization } from '@/catalog/product-display-option/serialization';
import { DisplayLanguage } from '@/language/display-language/entity';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class ProductListSerialization {
  readonly id: string;
  readonly sku: string;
  readonly brand: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Transform(({ value }) => value?.[0])
  @Type(() => ProductDisplayOptionListSerialization)
  @Expose({ name: 'displayOptions' })
  readonly displayOption: ProductDisplayOptionListSerialization;

  @Exclude()
  readonly language: DisplayLanguage;

  @Exclude()
  readonly deletedAt: Date;
}

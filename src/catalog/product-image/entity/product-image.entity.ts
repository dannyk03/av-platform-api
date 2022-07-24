import {
  Entity,
  Column,
  ManyToMany,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { ProductDisplayOption } from '@/catalog/product-display-option/entity';
//

@Entity()
export class ProductImage extends BaseEntity<ProductImage> {
  @Index()
  @Column({
    length: 30,
  })
  fileName!: string;

  @Column({
    unique: true,
    length: 32,
  })
  assetId!: string;

  @Column({
    unique: true,
    length: 100,
  })
  publicId!: string;

  @Column({
    unique: true,
    length: 200,
  })
  secureUrl!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  additionalData?: object;

  @ManyToOne(
    () => ProductDisplayOption,
    (displayOption) => displayOption.images,
  )
  @JoinColumn()
  productDisplayOption: ProductDisplayOption;
}

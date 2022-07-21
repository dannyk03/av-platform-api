import { Entity, Column, ManyToMany, Index } from 'typeorm';
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

  @ManyToMany(() => ProductDisplayOption)
  productDisplayOptions!: ProductDisplayOption[];
}

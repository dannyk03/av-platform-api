import {
  Entity,
  Column,
  ManyToMany,
  Index,
  BeforeInsert,
  JoinTable,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { ProductDisplayOption } from '@/catalog/product-display-option/entity';
//
import { slugify } from '@/utils/helper';

@Entity()
export class ProductImage extends BaseEntity<ProductImage> {
  @Index()
  @Column({
    unique: true,
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

  @BeforeInsert()
  beforeInsert() {
    this.fileName = slugify(this.fileName);
  }
}

import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';

import { ProductDisplayOption } from '@/catalog/product-display-option/entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class Product extends BaseEntity<Product> {
  @Index()
  @Column({
    length: 30,
    unique: true,
  })
  sku!: string;

  @Index()
  @Column({
    nullable: true,
    length: 30,
  })
  brand?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(
    () => ProductDisplayOption,
    (productDisplayOption) => productDisplayOption.product,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  displayOptions!: ProductDisplayOption[];

  @BeforeInsert()
  beforeInsert() {
    this.sku = this.sku.toUpperCase();
  }
}

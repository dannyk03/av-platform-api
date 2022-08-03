import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { ProductDisplayOption } from '@/catalog/product-display-option/entity';
import { BaseEntity } from '@/database/entity';
import { Gift } from '@/gifting/gift/entity/gift.entity';

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
    },
  )
  displayOptions!: ProductDisplayOption[];

  @ManyToMany(() => Gift, (giftOption) => giftOption.products)
  giftOptions: Gift[];

  @BeforeInsert()
  beforeInsert() {
    this.sku = this.sku.toUpperCase();
  }
}

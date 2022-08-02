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
import { GiftOption } from '@/gifting/gift/entity/gift-option.entity';

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

  @ManyToMany(() => GiftOption, (giftOption) => giftOption.products)
  giftOptions: GiftOption[];

  @BeforeInsert()
  beforeInsert() {
    this.sku = this.sku.toUpperCase();
  }
}

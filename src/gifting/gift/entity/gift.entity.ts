import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { GiftSelect } from './gift-select.entity';
import { Product } from '@/catalog/product/entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class Gift extends BaseEntity<Gift> {
  @ManyToMany(() => Product, (product) => product.giftOptions)
  @JoinTable({
    name: 'gifts_products',
    joinColumn: {
      name: 'gift_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products!: Product[];

  @ManyToOne(() => GiftIntent, (giftIntent) => giftIntent.giftOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  giftIntent!: GiftIntent;

  @ManyToOne(() => GiftSelect, (giftSelect) => giftSelect.gifts, {
    nullable: true,
  })
  @JoinColumn()
  giftSelect?: GiftSelect;
}

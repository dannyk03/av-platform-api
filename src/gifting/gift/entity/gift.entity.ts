import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { GiftOrder } from './gift-order.entity';
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

  @ManyToOne(() => Gift, (gift) => gift.order)
  @JoinColumn()
  order!: GiftOrder;
}

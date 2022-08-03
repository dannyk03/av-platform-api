import { Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { GiftOrder } from './gift-order.entity';
import { Product } from '@/catalog/product/entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class Gift extends BaseEntity<Gift> {
  @ManyToMany(() => Product)
  products!: Product[];

  @ManyToOne(() => GiftIntent, (giftIntent) => giftIntent.giftOptions)
  @JoinColumn()
  giftIntent!: GiftIntent;

  @ManyToOne(() => Gift, (gift) => gift.order)
  @JoinColumn()
  order!: GiftOrder;
}

import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { Gift } from './gift.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftOrder extends BaseEntity<GiftOrder> {
  @OneToOne(() => GiftIntent, (giftIntent) => giftIntent.giftOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  giftIntent!: GiftIntent;

  @OneToMany(() => Gift, (gift) => gift.order)
  gifts!: Gift[];
}

import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { GiftIntent } from '@/gifting/entity';
import { User } from '@/user/entity';

@Entity()
export class GiftOrder extends BaseEntity<GiftOrder> {
  @OneToOne(() => GiftIntent, (giftIntent) => giftIntent.order)
  giftIntent!: GiftIntent;

  @ManyToOne(() => User, (user) => user.giftOrders, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  user!: User;
}

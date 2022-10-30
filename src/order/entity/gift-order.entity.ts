import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { GiftIntent } from '@/gifting/entity';
import { User } from '@/user/entity';

@Entity()
export class GiftOrder extends BaseEntity<GiftOrder> {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({
    nullable: true,
  })
  paidAt?: Date;

  @Column({
    nullable: true,
  })
  shippedAt?: Date;

  @Column({
    nullable: true,
  })
  deliveredAt?: Date;

  @OneToOne(() => GiftIntent, (giftIntent) => giftIntent.order)
  giftIntent!: GiftIntent;

  @ManyToOne(() => User, (user) => user.giftOrders, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  user!: User;
}

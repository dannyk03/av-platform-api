import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { GiftIntent } from '@/gifting/entity';
import { User } from '@/user/entity';

import { PaymentIntentStatuses } from '../order.constants';

@Entity()
export class GiftOrder extends BaseEntity<GiftOrder> {
  @Column({
    length: 255,
    nullable: true,
    unique: true,
  })
  stripePaymentIntentId?: string;

  @OneToOne(() => GiftIntent, (giftIntent) => giftIntent.order, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  giftIntent!: GiftIntent;

  @ManyToOne(() => User, (user) => user.giftOrders, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  user!: User;

  @Column({
    length: 255,
    nullable: true,
  })
  paymentStatus?: PaymentIntentStatuses;

  // All 'totalPrice' calculations should be performed in 'real time' against GiftIntent entity,
  // and at the time of the desire to pay, because it is something dynamic and can change between the moment it was
  // submitted and the moment the customer wants to pay.
  // The goal in this dynamism is not to create duplicate data and stale data.
  // This entity is more responsible for things like discounts or promo codes applied (in the future),
}

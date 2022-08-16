import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftIntentReadyLink extends BaseEntity<GiftIntentReadyLink> {
  @Index()
  @Column({
    unique: true,
    length: 21,
    update: false,
  })
  code!: string;

  @Column({ nullable: true })
  usedAt?: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @OneToOne(() => GiftIntent, (giftIntent) => giftIntent.readyLink)
  @JoinColumn()
  giftIntent!: GiftIntent;
}

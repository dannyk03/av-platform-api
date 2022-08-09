import { Column, Entity, Index, OneToMany } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftIntentConfirmationLink extends BaseEntity<GiftIntentConfirmationLink> {
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

  @OneToMany(() => GiftIntent, (gift) => gift.confirmationLink)
  giftIntents!: GiftIntent[];
}

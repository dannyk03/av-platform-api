import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { Gift } from './gift.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftSubmit extends BaseEntity<GiftSubmit> {
  @OneToOne(() => GiftIntent, (giftIntent) => giftIntent.giftSubmit, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  giftIntent!: GiftIntent;

  @OneToMany(() => Gift, (gift) => gift.giftSubmit)
  gifts!: Gift[];

  @Column({
    length: 500,
  })
  personalNote?: string;
}

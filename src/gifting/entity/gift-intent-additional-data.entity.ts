import { EnumOccasion } from '@avo/type';

import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { Currency } from '@/currency/entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftIntentAdditionalData extends BaseEntity<GiftIntentAdditionalData> {
  @OneToOne(() => GiftIntent)
  gift: GiftIntent;

  @Column()
  priceMax?: number;

  @Column()
  priceMin?: number;

  @ManyToOne(() => Currency, { nullable: true })
  @JoinColumn()
  currency?: Currency;

  @Column({
    type: 'enum',
    enum: EnumOccasion,
  })
  occasion: EnumOccasion;
}

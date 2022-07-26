import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { EnumOccasion } from '@avo/type';

import { Gift } from './gift.entity';
import { Currency } from '@/currency/entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftAdditionalData extends BaseEntity<GiftAdditionalData> {
  @OneToOne(() => Gift)
  gift: Gift;

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

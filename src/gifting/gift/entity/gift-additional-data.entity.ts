import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
// Entities
import { Gift } from './gift.entity';
import { Currency } from '@/currency/entity';
//
import { BaseEntity } from '@/database/entity';
import { EnumOccasion } from '@avo/type';

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
    length: 20,
  })
  occasion: string;
}

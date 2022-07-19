import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
// Entities
import { Gift } from './gift.entity';
import { Currency } from '@/currency/entity';
//
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftAdditionalData extends BaseEntity<GiftAdditionalData> {
  @OneToOne(() => Gift)
  gift: Gift;

  @Column()
  priceMax: number;

  @Column()
  priceMin: number;

  @ManyToOne(() => Currency)
  @JoinColumn()
  currency: Currency;
}

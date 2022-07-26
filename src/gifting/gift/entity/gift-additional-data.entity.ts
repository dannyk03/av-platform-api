import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
// Entities
import { Currency } from '$/currency/entity';
import { Gift } from './gift.entity';
//
import { BaseEntity } from '$/database/entity';
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
    type: 'enum',
    enum: EnumOccasion,
  })
  occasion: EnumOccasion;
}

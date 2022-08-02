import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { GiftOption } from './gift-option.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class Gift extends BaseEntity<Gift> {
  @ManyToOne(() => GiftIntent, (giftIntent) => giftIntent.giftOptions)
  @JoinColumn()
  giftIntent!: GiftIntent;

  @OneToMany(() => GiftOption, (giftOption) => giftOption.gift)
  selectedGiftOptions!: GiftOption[];
}

import { Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { Gift } from './gift.entity';
import { Product } from '@/catalog/product/entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftOption extends BaseEntity<GiftOption> {
  @ManyToMany(() => Product)
  products!: Product[];

  @ManyToOne(() => GiftIntent, (giftIntent) => giftIntent.giftOptions)
  @JoinColumn()
  giftIntent!: GiftIntent;

  @ManyToOne(() => Gift, (gift) => gift.selectedGiftOptions)
  @JoinColumn()
  gift!: Gift;
}

import { Column, Entity, Index, OneToMany } from 'typeorm';

import { Gift } from './gift.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftSendConfirmationLink extends BaseEntity<GiftSendConfirmationLink> {
  @Index()
  @Column({
    unique: true,
    length: 16,
    update: false,
  })
  code!: string;

  @Column({ nullable: true })
  usedAt?: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @OneToMany(() => Gift, (gift) => gift.confirmationLink)
  gifts!: Gift[];
}

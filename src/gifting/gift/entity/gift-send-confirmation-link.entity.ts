import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '@/database/entity';

import { Gift } from './gift.entity';

@Entity()
export class GiftSendConfirmationLink extends BaseEntity<GiftSendConfirmationLink> {
  @Index()
  @Column({
    unique: true,
    length: 32,
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

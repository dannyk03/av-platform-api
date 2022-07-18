import { Entity, Column, Index, OneToMany } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { Gift } from './gift.entity';
//

@Entity()
export class GiftSendVerificationLink extends BaseEntity<GiftSendVerificationLink> {
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

  @OneToMany(() => Gift, (gift) => gift.verificationLink)
  gifts!: Gift[];
}

import { Entity, Column, Index } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
//

@Entity()
export class GuestGiftSend extends BaseEntity<GuestGiftSend> {
  @Index()
  @Column({
    length: 50,
  })
  senderEmail!: string;

  @Column({
    length: 30,
    nullable: true,
  })
  senderFirstName?: string;

  @Column({
    length: 30,
    nullable: true,
  })
  senderLastName?: string;

  @Index()
  @Column({
    length: 50,
  })
  recipientEmail!: string;

  @Index()
  @Column({
    length: 32,
  })
  verifyCode!: string;

  @Column({
    nullable: true,
  })
  sentAt?: Date;

  @Column({
    nullable: true,
  })
  acceptedAt?: Date;

  @Column({
    nullable: true,
  })
  approvedAt?: Date;

  @Column({
    nullable: true,
  })
  shippedAt?: Date;

  @Column({
    nullable: true,
  })
  deliveredAt?: Date;
}

import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { GiftRecipient } from './gift-recipient.entity';
import { GiftSender } from './gift-sender.entity';
import { GiftSendConfirmationLink } from './gift-send-confirmation-link.entity';
//

@Entity()
export class Gift extends BaseEntity<Gift> {
  @OneToOne(() => GiftRecipient, {
    cascade: ['insert'],
  })
  @JoinColumn()
  recipient: GiftRecipient;

  @OneToOne(() => GiftSender, {
    cascade: ['insert'],
  })
  @JoinColumn()
  sender!: GiftSender;

  @Column({
    nullable: true,
  })
  confirmedAt?: Date;

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

  @OneToMany(
    () => GiftSendConfirmationLink,
    (verificationLink) => verificationLink.gifts,
  )
  verificationLink!: GiftSendConfirmationLink;
}

import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity';

import { GiftAdditionalData } from './gift-additional-data.entity';
import { GiftRecipient } from './gift-recipient.entity';
import { GiftSendConfirmationLink } from './gift-send-confirmation-link.entity';
import { GiftSender } from './gift-sender.entity';

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

  @OneToOne(() => GiftAdditionalData, {
    nullable: true,
    cascade: ['insert'],
  })
  @JoinColumn()
  additionalData?: GiftAdditionalData;

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

  @ManyToOne(
    () => GiftSendConfirmationLink,
    (verificationLink) => verificationLink.gifts,
  )
  @JoinColumn()
  confirmationLink!: GiftSendConfirmationLink;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { GiftIntentAdditionalData } from './gift-intent-additional-data.entity';
import { GiftIntentConfirmationLink } from './gift-intent-confirmation-link.entity';
import { GiftRecipient } from './gift-recipient.entity';
import { GiftSender } from './gift-sender.entity';
import { GiftSubmit } from './gift-submit.entity';
import { Gift } from './gift.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftIntent extends BaseEntity<GiftIntent> {
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

  @OneToOne(() => GiftIntentAdditionalData, {
    nullable: true,
    cascade: ['insert'],
  })
  @JoinColumn()
  additionalData?: GiftIntentAdditionalData;

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
  readyAt?: Date;

  @Column({
    nullable: true,
  })
  submittedAt?: Date;

  @Column({
    nullable: true,
  })
  shippedAt?: Date;

  @Column({
    nullable: true,
  })
  deliveredAt?: Date;

  @ManyToOne(
    () => GiftIntentConfirmationLink,
    (verificationLink) => verificationLink.giftIntents,
  )
  @JoinColumn()
  confirmationLink!: GiftIntentConfirmationLink;

  @OneToMany(() => Gift, (giftOption) => giftOption.giftIntent, {
    nullable: true,
    cascade: true,
  })
  giftOptions?: Gift[];

  @OneToOne(() => GiftSubmit, (giftSubmit) => giftSubmit.giftIntent, {
    nullable: true,
    cascade: true,
  })
  giftSubmit?: GiftSubmit[];
}

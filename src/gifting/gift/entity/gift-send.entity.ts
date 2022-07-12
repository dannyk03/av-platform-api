import { Entity, Column, Index, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { User } from '@/user/entity/user.entity';
//
import { EnumGiftSendStatus } from '../gift.constant';

@Entity()
export class GiftSend extends BaseEntity<GiftSend> {
  @Index()
  @Column({
    type: 'varchar',
    length: 100,
  })
  recipientEmail: string;

  @ManyToOne(() => User)
  sender!: User;

  @Column({
    nullable: true,
  })
  sentAt?: Date;

  @Column({
    type: 'enum',
    enum: EnumGiftSendStatus,
    default: EnumGiftSendStatus.New,
  })
  status: EnumGiftSendStatus;
}

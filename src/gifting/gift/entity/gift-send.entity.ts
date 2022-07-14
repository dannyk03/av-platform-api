import { Entity, Column, Index, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';
//

@Entity()
export class GiftSend extends BaseEntity<GiftSend> {
  @Index()
  @Column({
    length: 30,
  })
  recipientEmail: string;

  // TODO budget
  // TODO notes

  @ManyToOne(() => User)
  sender!: User;

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

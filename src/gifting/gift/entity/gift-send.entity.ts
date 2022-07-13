import { Entity, Column, Index, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { User } from '@/user/entity/user.entity';
//

@Entity()
export class GiftSend extends BaseEntity<GiftSend> {
  @Index()
  @Column({
    type: 'varchar',
    length: 30,
  })
  recipientEmail: string;

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

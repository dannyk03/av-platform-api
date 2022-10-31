import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
export class StripePayment extends BaseEntity<StripePayment> {
  @Index()
  @Column({
    length: 255,
    unique: true,
  })
  customerId!: string;

  @OneToOne(() => User, (user) => user.stripe, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}

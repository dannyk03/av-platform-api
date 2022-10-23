import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity/user.entity';

@Entity()
export class InvatationLink extends BaseEntity<InvatationLink> {
  @OneToOne(() => User, (user) => user.invatationLink, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}

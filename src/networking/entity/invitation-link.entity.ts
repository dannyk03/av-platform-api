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
export class InvitationLink extends BaseEntity<InvitationLink> {
  @OneToOne(() => User, (user) => user.invitationLink, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}

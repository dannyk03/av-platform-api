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
export class InavatationLink extends BaseEntity<InavatationLink> {
  @JoinColumn()
  user!: User;
}

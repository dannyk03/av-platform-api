import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
export class Group extends BaseEntity<Group> {
  @Index()
  @Column({
    unique: true,
    length: 300,
  })
  name!: string;

  @Column({
    nullable: true,
    length: 1000,
  })
  description?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;
}

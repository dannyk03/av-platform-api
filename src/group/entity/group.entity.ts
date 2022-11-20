import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

import { slugify } from '@/utils/helper';

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

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable({
    name: 'groups_users',
    joinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({
    name: 'owner_user_id',
  })
  owner!: User;
}

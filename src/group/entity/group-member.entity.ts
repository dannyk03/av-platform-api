import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { Group } from './group.entity';
import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

import { EnumGroupRole } from '../type';

@Entity()
@Unique(['user', 'group'])
export class GroupMember extends BaseEntity<GroupMember> {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user!: User;

  @ManyToOne(() => Group, (group) => group.members, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  group!: Group;

  @Column({
    type: 'enum',
    enum: EnumGroupRole,
    nullable: true,
  })
  role?: EnumGroupRole;
}

import { EnumGroupInviteStatus, EnumGroupRole } from '@avo/type';

import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';

import { Group } from './group.entity';
import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique(['user', 'code'])
export class GroupInviteMember extends BaseEntity<GroupInviteMember> {
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
    default: EnumGroupRole.Basic,
  })
  role!: EnumGroupRole;

  @Index()
  @Column({
    unique: true,
    length: 21,
    update: false,
  })
  code!: string;

  @Index()
  @Column({
    type: 'enum',
    enum: EnumGroupInviteStatus,
    default: EnumGroupInviteStatus.Pending,
  })
  inviteStatus!: EnumGroupInviteStatus;

  @Index()
  @Column({
    unique: true,
    length: 50,
    nullable: true,
  })
  tempEmail?: string;

  @Column({ nullable: true })
  expiresAt?: Date;
}

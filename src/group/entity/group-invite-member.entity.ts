import { EnumGroupInviteStatus, EnumGroupRole } from '@avo/type';

import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';

import { Group } from './group.entity';
import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_group_id_temp_email', ['group', 'tempEmail'])
export class GroupInviteMember extends BaseEntity<GroupInviteMember> {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true,
  })
  inviteeUser?: User;

  @ManyToOne(() => Group, (group) => group.members, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  group!: Group;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true,
  })
  inviterUser?: User;

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
    length: 50,
    nullable: true,
  })
  tempEmail?: string;

  @Column({ nullable: true })
  expiresAt?: Date;
}

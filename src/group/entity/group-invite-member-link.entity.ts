import { EnumGroupInviteStatus, EnumGroupRole } from '@avo/type';

import { Check, Column, Entity, Index, ManyToOne, Unique } from 'typeorm';

import { Group } from './group.entity';
import { BaseEntity } from '@/database/entity';
import { User } from '@/user/entity';

@Entity()
@Unique('uq_group_id_temp_email', ['group', 'tempEmail'])
@Unique('uq_group_id_user_id_status', ['group', 'inviteeUser', 'status'])
@Check(
  'chk_group_invite_member_links_temp_email_or_user_invitee_id',
  'temp_email IS NOT NULL OR invitee_user_id IS NOT NULL',
)
@Check(
  'chk_group_invite_member_link_invitee_not_inviter',
  'invitee_user_id != inviter_user_id',
)
export class GroupInviteMemberLink extends BaseEntity<GroupInviteMemberLink> {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true,
  })
  inviteeUser?: User;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  inviterUser: User;

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
  status!: EnumGroupInviteStatus;

  @Index()
  @Column({
    length: 50,
    nullable: true,
  })
  tempEmail?: string;

  @Column({ nullable: true })
  expiresAt?: Date;
}

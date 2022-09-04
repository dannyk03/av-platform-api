import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { Organization } from '@/organization/entity';
import { User } from '@/user/entity';
import { AclRole } from '@acl/role/entity';

@Entity()
@Unique('uq_organization_user_role_invite', ['email', 'role', 'organization'])
export class OrganizationInviteLink extends BaseEntity<OrganizationInviteLink> {
  @Index()
  @Column({
    length: 50,
  })
  email!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  user?: User;

  @ManyToOne(() => User)
  fromUser!: User;

  @Index()
  @Column({
    unique: true,
    length: 21,
    update: false,
  })
  code!: string;

  @Column({ nullable: true })
  usedAt?: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => AclRole, (role) => role.invites)
  role!: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.invites)
  organization!: Organization;
}

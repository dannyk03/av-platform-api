import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  JoinColumn,
  OneToOne,
  ManyToOne,
  Unique,
  OneToMany,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { Organization } from '@/organization/entity/organization.entity';
import { AclPolicy } from '@acl/policy/entity/acl-policy.entity';
import { User } from '@/user/entity/user.entity';
import { OrganizationInvite } from '@/organization/entity/organization-invite.entity';
//
import { slugify } from '@/utils/helper';

@Entity()
@Unique('uq_role_organization', ['slug', 'name', 'organization'])
export class AclRole extends BaseEntity<AclRole> {
  @Index()
  @Column({
    update: false,
    length: 30,
  })
  slug: string;

  @Column({
    update: false,
    length: 30,
  })
  name: string;

  @ManyToOne(() => Organization, (organization) => organization.roles)
  organization!: Organization;

  @OneToOne(() => AclPolicy, {
    cascade: true,
  })
  @JoinColumn()
  policy: AclPolicy;

  @Column({
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.role)
  users!: User;

  @OneToMany(() => OrganizationInvite, (userInvite) => userInvite.role)
  invites!: OrganizationInvite;

  @BeforeInsert()
  beforeInsert() {
    this.slug = slugify(this.name);
  }
}

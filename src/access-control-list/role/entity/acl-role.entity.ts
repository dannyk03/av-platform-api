import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
// Entities
import { BaseEntity } from '$/database/entity';
import { Organization, OrganizationInviteLink } from '$/organization/entity';
import { User } from '$/user/entity';
import { AclPolicy } from '$acl/policy/entity';
//
import { slugify } from '$/utils/helper';

@Entity()
@Unique(['slug', 'name', 'organization'])
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

  @OneToMany(() => OrganizationInviteLink, (userInvite) => userInvite.role)
  invites!: OrganizationInviteLink;

  @BeforeInsert()
  beforeInsert() {
    this.slug = slugify(this.name);
  }
}

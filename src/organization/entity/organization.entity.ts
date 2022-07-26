import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
// Entities
import { BaseEntity } from '$/database/entity';
import { OrganizationInviteLink } from '$/organization/entity';
import { User } from '$/user/entity';
import { AclRole } from '$acl/role/entity';
//
import { slugify } from '$/utils/helper';

@Entity()
export class Organization extends BaseEntity<Organization> {
  @Column({
    unique: true,
    length: 30,
  })
  name!: string;

  @Column({
    unique: true,
    length: 30,
  })
  slug!: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => AclRole, (role) => role.organization, {
    cascade: true,
  })
  roles: AclRole[];

  @OneToMany(() => User, (user) => user.organization, {
    cascade: true,
  })
  users: User[];

  @OneToMany(
    () => OrganizationInviteLink,
    (userInvite) => userInvite.organization,
  )
  invites!: OrganizationInviteLink;

  @BeforeInsert()
  beforeInsert() {
    this.slug = slugify(this.name);
  }
}

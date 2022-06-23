import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { createSlugFromString } from '@/utils/helper';
import { AclRole } from '@acl/role/entity/acl-role.entity';
import { User } from '@/user/entity/user.entity';

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

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}

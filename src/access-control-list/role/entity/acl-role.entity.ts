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
import { BaseEntity } from '@/database/entities/base.entity';
import { createSlugFromString } from '@/utils/helper/service';
import { Organization } from '@/organization/entity/organization.entity';
import { AclPolicy } from '@acl/policy/entity/acl-policy.entity';
import { User } from '@/user/entity/user.entity';

@Entity()
@Unique('unique_role_organization', ['slug', 'name', 'organization'])
export class AclRole extends BaseEntity<AclRole> {
  @Index('role_slug_index')
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

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}

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
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';
import { Organization } from '@/organization/entity/organization.entity';
import { AcpPolicy } from '@/access-control-policy/policy/entity/acp-policy.entity';
import { User } from '@/user/entity/user.entity';

@Entity()
@Unique(['slug', 'name', 'organization'])
export class AcpRole extends BaseEntity<AcpRole> {
  @Index('role_slug_index')
  @Column({
    update: false,
    length: 20,
  })
  slug: string;

  // TODO:  Do we really need name and slug together?
  @Column({
    update: false,
    length: 20,
  })
  name: string;

  @ManyToOne(() => Organization, (organization) => organization.roles)
  organization!: Organization;

  @OneToOne(() => AcpPolicy, {
    cascade: true,
  })
  @JoinColumn()
  policy: AcpPolicy;

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

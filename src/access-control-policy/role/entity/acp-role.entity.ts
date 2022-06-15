import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  JoinColumn,
  OneToOne,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';
import { AcpPolicy } from '../../policy/entity/acp-policy.entity';
import { Organization } from '@/organization/entity/organization.entity';

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
    // onDelete: 'CASCADE',
  })
  @JoinColumn()
  policy: AcpPolicy;

  @Column({
    default: true,
  })
  isActive: boolean;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}

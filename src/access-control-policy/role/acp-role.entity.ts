import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';
import { AcpPolicy } from '../policy/acp-policy.entity';

@Entity()
export class AcpRole extends BaseEntity<AcpRole> {
  @Index('role_slug_index')
  @Column({
    update: false,
    unique: true,
    length: 20,
  })
  slug: string;

  // TODO:  Do we really need name and slug together?
  @Column({
    update: false,
    unique: true,
    length: 20,
  })
  name: string;

  @JoinTable({
    name: 'role_policy',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'policy_id',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => AcpPolicy, (policy) => policy.roles, {
    // eager: true,
    cascade: true,
  })
  policies: AcpPolicy[];

  @Column({
    default: true,
  })
  isActive: boolean;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}

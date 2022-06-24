import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { createSlugFromString } from '@/utils/helper/service';
import { AclPolicy } from '@acl/policy/entity/acl-policy.entity';

@Entity()
export class AclRolePreset extends BaseEntity<AclRolePreset> {
  @Index('role_preset_slug_index')
  @Column({
    update: false,
    unique: true,
    length: 30,
  })
  slug: string;

  @Column({
    update: false,
    unique: true,
    length: 30,
  })
  name: string;

  @OneToOne(() => AclPolicy, {
    cascade: true,
  })
  @JoinColumn()
  policy: AclPolicy;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}

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
import { AcpPolicy } from '@acp/policy/entity/acp-policy.entity';

@Entity()
export class AcpRolePreset extends BaseEntity<AcpRolePreset> {
  @Index('role_preset_slug_index')
  @Column({
    update: false,
    unique: true,
    length: 20,
  })
  slug: string;

  @Column({
    update: false,
    unique: true,
    length: 20,
  })
  name: string;

  @OneToOne(() => AcpPolicy, {
    cascade: true,
  })
  @JoinColumn()
  policy: AcpPolicy;

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}

import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { AclPolicy } from '@acl/policy/entity';
//
import { slugify } from '@/utils/helper';

@Entity()
export class AclRolePreset extends BaseEntity<AclRolePreset> {
  @Index()
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
    this.slug = slugify(this.name);
  }
}

import {
  Entity,
  Column,
  JoinTable,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '@/database/entities/base.entity';
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';
import { AcpRole } from '@/access-control-policy/role/entity/acp-role.entity';
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

  @OneToMany(() => AcpRole, (role) => role.id, {
    // eager: true,
    cascade: true,
  })
  roles: AcpRole[];

  @OneToMany(() => User, (user) => user.id, {
    // eager: true,
    cascade: true,
  })
  users: User[];

  @BeforeInsert()
  beforeInsert() {
    this.slug = createSlugFromString(this.name);
  }
}

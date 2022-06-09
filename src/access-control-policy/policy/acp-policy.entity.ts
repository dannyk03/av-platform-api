import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { Permission } from '@/permission/entity/permission.entity';
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';
import { defineAbility, createAliasResolver } from '@casl/ability';
import { AcpAbility } from '../ability/acp-ability.entity';
import { AcpSubject } from '../subject/acp-subject.entity';
import { AcpRole } from '../role/acp-role.entity';

type SensitivityLevelRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10;

@Entity()
export class AcpPolicy extends BaseEntity<AcpPolicy> {
  @Column({
    default: 1,
  })
  sensitivityLevel: SensitivityLevelRange;

  @OneToMany(() => AcpSubject, (subject) => subject.policy)
  subjects: AcpSubject[];

  @ManyToMany(() => AcpPolicy, (policy) => policy.roles)
  roles: AcpRole[];
}

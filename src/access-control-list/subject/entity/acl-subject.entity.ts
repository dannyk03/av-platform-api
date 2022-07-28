import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { SubjectType, Subjects } from '@avo/casl';

import { BaseEntity } from '@/database/entity';
import { AclAbility } from '@acl/ability/entity';
import { AclPolicy } from '@acl/policy/entity';

@Entity()
export class AclSubject extends BaseEntity<AclSubject> {
  @Column({
    type: 'enum',
    enum: Subjects,
  })
  type: SubjectType;

  @OneToMany(() => AclAbility, (ability) => ability.subject, {
    cascade: true,
    eager: true,
  })
  abilities: AclAbility[];

  @ManyToOne(() => AclPolicy, (policy) => policy.subjects)
  policy: AclPolicy;
}

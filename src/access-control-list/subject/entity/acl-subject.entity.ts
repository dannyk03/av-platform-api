import { AclAbility } from '@acl/ability/entity';
import { AclPolicy } from '@acl/policy/entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Subject, SubjectType } from '@avo/casl';

import { BaseEntity } from '@/database/entity';

@Entity()
export class AclSubject extends BaseEntity<AclSubject> {
  @Column({
    type: 'enum',
    enum: Subject,
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

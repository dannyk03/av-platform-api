import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { SubjectType, Subject } from '@avo/casl';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { AclPolicy } from '@acl/policy/entity/acl-policy.entity';
import { AclAbility } from '@acl/ability/entity/acl-ability.entity';
//

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

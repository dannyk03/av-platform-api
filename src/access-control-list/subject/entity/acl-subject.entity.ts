import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { AclPolicy } from '@acl/policy/entity/acl-policy.entity';
import { AclAbility } from '@acl/ability/entity/acl-ability.entity';
//
import { AclSubjectDict, AclSubjectType } from '../acl-subject.constant';

@Entity()
export class AclSubject extends BaseEntity<AclSubject> {
  @Column({
    type: 'enum',
    enum: Object.keys(AclSubjectDict),
  })
  type: AclSubjectType;

  @OneToMany(() => AclAbility, (ability) => ability.subject, {
    cascade: true,
    eager: true,
  })
  abilities: AclAbility[];

  @ManyToOne(() => AclPolicy, (policy) => policy.subjects)
  policy: AclPolicy;
}

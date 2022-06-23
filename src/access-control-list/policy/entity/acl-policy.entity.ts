import { Entity, Column, OneToMany, Check } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AclSubject } from '@acl/subject/entity/acl-subject.entity';

@Entity({ name: 'acl_policies' })
@Check('sensitivity_level', 'sensitivity_level BETWEEN 1 AND 10')
export class AclPolicy extends BaseEntity<AclPolicy> {
  @Column({
    type: 'smallint',
    default: 1,
  })
  sensitivityLevel: number;

  @OneToMany(() => AclSubject, (subject) => subject.policy, {
    cascade: true,
    eager: true,
  })
  subjects: AclSubject[];
}

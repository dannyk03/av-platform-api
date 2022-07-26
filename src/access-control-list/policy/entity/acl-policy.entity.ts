import { AclSubject } from '@acl/subject/entity';
import { Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@/database/entity';

@Entity({ name: 'acl_policies' })
export class AclPolicy extends BaseEntity<AclPolicy> {
  @OneToMany(() => AclSubject, (subject) => subject.policy, {
    cascade: true,
    eager: true,
  })
  subjects: AclSubject[];
}

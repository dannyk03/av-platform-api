import { Entity, OneToMany } from 'typeorm';
// Entities
import { BaseEntity } from '$/database/entity';
import { AclSubject } from '$acl/subject/entity';
//

@Entity({ name: 'acl_policies' })
export class AclPolicy extends BaseEntity<AclPolicy> {
  @OneToMany(() => AclSubject, (subject) => subject.policy, {
    cascade: true,
    eager: true,
  })
  subjects: AclSubject[];
}

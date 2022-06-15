import { Entity, Column, ManyToMany, OneToMany, Check } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AcpSubject } from '@/access-control-policy/subject/entity/acp-subject.entity';

@Entity({ name: 'acp_policies' })
// @Check('sensitivityLevel BETWEEN 1 AND 10')
export class AcpPolicy extends BaseEntity<AcpPolicy> {
  @Column({
    type: 'smallint',
    default: 1,
  })
  sensitivityLevel: number;

  @OneToMany(() => AcpSubject, (subject) => subject.policy, {
    cascade: true,
  })
  subjects: AcpSubject[];

  // @ManyToMany(() => AcpPolicy, (policy) => policy.roles)
  // roles: AcpRole[];
}

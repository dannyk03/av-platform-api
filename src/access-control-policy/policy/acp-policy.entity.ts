import { Entity, Column, ManyToMany, OneToMany, Check } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AcpSubject } from '../subject/acp-subject.entity';
import { AcpRole } from '../role/acp-role.entity';

@Entity()
// @Check('sensitivityLevel BETWEEN 1 AND 10')
export class AcpPolicy extends BaseEntity<AcpPolicy> {
  @Column({
    type: 'smallint',
    default: 1,
  })
  sensitivityLevel: number;

  @OneToMany(() => AcpSubject, (subject) => subject.policy)
  subjects: AcpSubject[];

  @ManyToMany(() => AcpPolicy, (policy) => policy.roles)
  roles: AcpRole[];
}

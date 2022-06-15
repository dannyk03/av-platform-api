import { Entity, Column, OneToMany, ManyToOne, Check } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AcpSubjectDict, AcpSubjectType } from '../acp-subject.constant';
import { AcpPolicy } from '@/access-control-policy/policy/entity/acp-policy.entity';
import { AcpAbility } from '@/access-control-policy/ability/entity/acp-ability.entity';

@Entity()
// @Check('sensitivityLevel BETWEEN 1 AND 10')
export class AcpSubject extends BaseEntity<AcpSubject> {
  @Column({
    default: 1,
  })
  sensitivityLevel: number;

  @Column({
    type: 'enum',
    enum: Object.keys(AcpSubjectDict),
  })
  type: AcpSubjectType;

  @OneToMany(() => AcpAbility, (ability) => ability.subject, { cascade: true })
  abilities: AcpAbility[];

  @ManyToOne(() => AcpPolicy, (policy) => policy.subjects)
  policy: AcpPolicy;
}

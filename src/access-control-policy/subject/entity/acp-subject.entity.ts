import { Entity, Column, OneToMany, ManyToOne, Check } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AcpAbility } from '../../ability/entity/acp-ability.entity';
import { AcpPolicy } from '../../policy/entity/acp-policy.entity';
import { AcpSubjectDict, AcpSubjectType } from '..';

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

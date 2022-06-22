import { Entity, Column, OneToMany, ManyToOne, Check } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AcpPolicy } from '@acp/policy/entity/acp-policy.entity';
import { AcpAbility } from '@acp/ability/entity/acp-ability.entity';
import { AcpSubjectDict, AcpSubjectType } from '../acp-subject.constant';

@Entity()
@Check('sensitivity_level', 'sensitivity_level BETWEEN 1 AND 10')
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

  @OneToMany(() => AcpAbility, (ability) => ability.subject, {
    cascade: true,
    eager: true,
  })
  abilities: AcpAbility[];

  @ManyToOne(() => AcpPolicy, (policy) => policy.subjects)
  policy: AcpPolicy;
}

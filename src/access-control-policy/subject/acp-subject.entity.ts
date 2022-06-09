import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AcpAbility } from '../ability/acp-ability.entity';
import { AcpPolicy } from '../policy/acp-policy.entity';
import { AcpSubjectDict, AcpSubjectTypeEnum } from '../subject';

type SensitivityLevelRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10;

@Entity()
export class AcpSubject extends BaseEntity<AcpSubject> {
  @Column({
    default: 1,
  })
  sensitivityLevel: SensitivityLevelRange;

  @Column({
    type: 'enum',
    enum: Object.keys(AcpSubjectDict),
  })
  type: AcpSubjectTypeEnum;

  @OneToMany(() => AcpAbility, (ability) => ability.subject)
  abilities: AcpAbility[];

  @ManyToOne(() => AcpPolicy, (policy) => policy.subjects)
  policy: AcpPolicy;
}

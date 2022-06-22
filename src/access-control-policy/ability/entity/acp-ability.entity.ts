import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AbilityActionEnum, AbilityTypeEnum } from '../acp-ability.constant';
import { AcpSubject } from '@/access-control-policy/subject/entity/acp-subject.entity';
import { AbilityCondition } from '../ability.interface';

@Entity({ name: 'acp_abilities' })
export class AcpAbility extends BaseEntity<AcpAbility> {
  @Column({
    type: 'enum',
    enum: AbilityTypeEnum,
  })
  type!: AbilityTypeEnum;

  @Column({
    type: 'enum',
    enum: AbilityActionEnum,
    array: true,
  })
  actions!: AbilityActionEnum[];

  @Column({
    type: 'varchar',
    length: 20,
    array: true,
    nullable: true,
  })
  fieldsAccess?: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  conditions?: AbilityCondition;

  @ManyToOne(() => AcpSubject, (subject) => subject.abilities)
  subject!: AcpSubject;
}

import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AbilityActionEnum, AbilityTypeEnum } from '../acp-ability.constant';
import { AcpSubject } from '@/access-control-policy/subject/entity/acp-subject.entity';

@Entity()
export class AcpAbility extends BaseEntity<AcpAbility> {
  @Column({
    type: 'enum',
    enum: AbilityTypeEnum,
  })
  type!: AbilityTypeEnum;

  @Column({
    type: 'enum',
    enum: AbilityActionEnum,
  })
  action!: AbilityActionEnum;

  @Column({
    type: 'varchar',
    array: true,
    default: ['*'],
  })
  fieldsAccess!: string[];

  @Column({
    type: 'jsonb',
    default: {},
  })
  conditions!: string[];

  @ManyToOne(() => AcpSubject, (subject) => subject.abilities)
  subject!: AcpSubject;
}

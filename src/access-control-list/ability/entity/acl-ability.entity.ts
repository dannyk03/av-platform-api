import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/database/entities/base.entity';
import { AbilityActionEnum, AbilityTypeEnum } from '../acl-ability.constant';
import { AclSubject } from '@acl/subject/entity/acl-subject.entity';
import { AbilityCondition } from '../acl-ability.interface';

@Entity({ name: 'acl_abilities' })
export class AclAbility extends BaseEntity<AclAbility> {
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

  @ManyToOne(() => AclSubject, (subject) => subject.abilities)
  subject!: AclSubject;
}

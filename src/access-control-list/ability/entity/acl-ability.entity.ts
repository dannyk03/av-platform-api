import { Entity, Column, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { AclSubject } from '@acl/subject/entity/acl-subject.entity';
//
import {
  EnumAclAbilityAction,
  EnumAclAbilityType,
} from '../acl-ability.constant';
import { AbilityCondition } from '../acl-ability.interface';

@Entity({ name: 'acl_abilities' })
export class AclAbility extends BaseEntity<AclAbility> {
  @Column({
    type: 'enum',
    enum: EnumAclAbilityType,
  })
  type!: EnumAclAbilityType;

  @Column({
    type: 'enum',
    enum: EnumAclAbilityAction,
    array: true,
  })
  actions!: EnumAclAbilityAction[];

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

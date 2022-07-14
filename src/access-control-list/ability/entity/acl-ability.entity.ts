import { Entity, Column, ManyToOne } from 'typeorm';
import { Action, AbilityVerb } from '@avo/casl';
// Entities
import { BaseEntity } from '@/database/entity';
import { AclSubject } from '@acl/subject/entity';
//

@Entity({ name: 'acl_abilities' })
export class AclAbility extends BaseEntity<AclAbility> {
  @Column({
    type: 'enum',
    enum: AbilityVerb,
  })
  type!: AbilityVerb;

  @Column({
    type: 'enum',
    enum: Action,
  })
  action!: Action;

  // @Column({
  //   length: 30,
  //   array: true,
  //   nullable: true,
  // })
  // fields?: string[];

  // @Column({
  //   type: 'jsonb',
  //   nullable: true,
  // })
  // conditions?: AbilityCondition;

  @ManyToOne(() => AclSubject, (subject) => subject.abilities)
  subject!: AclSubject;
}

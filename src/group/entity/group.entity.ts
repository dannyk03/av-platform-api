import { Column, Entity, Index, OneToMany } from 'typeorm';

import { GroupMember } from './group-member.entity';
import { BaseEntity } from '@/database/entity';
import { GroupQuestion } from '@/group/entity/group-question.entity';

import { easilyReadableCodeLength } from '@/utils/helper/service';

@Entity()
export class Group extends BaseEntity<Group> {
  @Index()
  @Column({
    length: 300,
  })
  name!: string;

  @Column({
    unique: true,
    length: easilyReadableCodeLength,
  })
  code!: string;

  @Column({
    nullable: true,
    length: 1000,
  })
  description?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => GroupMember, (member) => member.group, {
    cascade: true,
  })
  members: GroupMember[];

  @OneToMany(() => GroupQuestion, (question) => question.group, {
    cascade: true,
  })
  questions: GroupQuestion[];
}

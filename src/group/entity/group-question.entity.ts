import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { GroupQuestionAnswer } from '@/group/entity/group-question-answer.entity';
import { Group } from '@/group/entity/group.entity';
import { User } from '@/user/entity';

@Entity()
export class GroupQuestion extends BaseEntity<GroupQuestion> {
  @Column({
    type: 'text',
  })
  data: string;

  @ManyToOne(() => Group, (group) => group.questions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  group: Group;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @OneToMany(
    () => GroupQuestionAnswer,
    (questionAnswer) => questionAnswer.question,
    {
      cascade: true,
    },
  )
  answers: GroupQuestionAnswer[];

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  createdBy: User;
}

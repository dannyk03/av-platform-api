import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@/database/entity';
import { GroupQuestion } from '@/group/entity';
import { User } from '@/user/entity';

@Entity()
export class GroupQuestionAnswer extends BaseEntity<GroupQuestionAnswer> {
  @Column({
    type: 'text',
  })
  data: string;

  @ManyToOne(() => GroupQuestion, (groupQuestion) => groupQuestion.answers, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'group_question_id',
  })
  question: GroupQuestion;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;
}

import { IGroupQuestionAnswerGetSerialization } from '@avo/type';

import { Exclude, Expose } from 'class-transformer';

import { GroupQuestionGetSerialization } from '@/group/serialization/';

@Exclude()
export class GroupQuestionAnswerGetSerialization
  implements IGroupQuestionAnswerGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  readonly data: string;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  @Expose()
  readonly question: GroupQuestionGetSerialization;
}

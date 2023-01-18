import { IGroupQuestionAnswerGetSerialization } from '@avo/type';

import { Exclude, Expose, Type } from 'class-transformer';

import { GroupQuestionGetSerialization } from '@/group/serialization/';
import { UserGetSerialization } from '@/user/serialization';

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

  @Expose()
  @Type(() => UserGetSerialization)
  readonly createdBy: UserGetSerialization;
}

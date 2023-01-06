import { IGroupQuestionGetSerialization } from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GroupQuestionGetSerialization
  implements IGroupQuestionGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  readonly data: string;

  @Expose()
  @Transform(({ value }) => value || 0)
  readonly answersCount: number;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}

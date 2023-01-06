import { IGroupQuestionGetSerialization } from '@avo/type';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GroupQuestionGetSerialization
  implements IGroupQuestionGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  readonly data: string;

  @Expose()
  readonly answersCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

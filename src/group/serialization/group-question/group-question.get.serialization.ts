import {
  IGroupQuestionGetSerialization,
  IGroupQuestionResponderGetSerialization,
  IGroupQuestionWithPreviewGetSerialization,
} from '@avo/type';

import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { GroupQuestion } from '@/group/entity';

import { UserGetSerialization } from '@/user/serialization';

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

  @Expose()
  @Type(() => UserGetSerialization)
  readonly createdBy: UserGetSerialization;
}

@Exclude()
export class GroupQuestionWithPreviewGetSerialization
  extends GroupQuestionGetSerialization
  implements IGroupQuestionWithPreviewGetSerialization
{
  @Expose()
  @Transform(({ obj }: { obj: GroupQuestion }) => {
    return obj.answers.map(({ createdBy }) => {
      return {
        id: createdBy?.id,
        firstName: createdBy?.profile?.firstName,
        lastName: createdBy?.profile?.lastName,
      };
    });
  })
  respondersPreview: IGroupQuestionResponderGetSerialization[];
}

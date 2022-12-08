import {
  IGroupGetSerialization,
  IGroupGetWithPreviewSerialization,
  IGroupMemberPreviewGetSerialization,
  IGroupUserSerialization,
} from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GroupGetSerialization implements IGroupGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly membersCount: number;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;
}
@Exclude()
export class GroupGetWithPreviewSerialization
  extends GroupGetSerialization
  implements IGroupGetWithPreviewSerialization
{
  @Expose()
  @Transform(({ value }) =>
    value.map(({ role, user }) => {
      return {
        role,
        id: user?.id,
        firstName: user?.profile?.firstName,
        lastName: user?.profile?.lastName,
      };
    }),
  )
  membersPreview: IGroupMemberPreviewGetSerialization[];
}

@Exclude()
export class GroupUserSerialization implements IGroupUserSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly phoneNumber: string;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  @Transform(({ obj }) => obj.profile?.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.profile?.lastName)
  readonly lastName: string;
}

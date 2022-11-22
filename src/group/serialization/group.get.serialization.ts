import {
  EnumGroupRole,
  IGroupGetSerialization,
  IGroupGetWithPreviewSerialization,
  IGroupMemberPreviewGetSerialization,
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
        email: user?.email,
        firstName: user?.profile?.firstName,
        lastName: user?.profile?.lastName,
      };
    }),
  )
  membersPreview: IGroupMemberPreviewGetSerialization[];
}

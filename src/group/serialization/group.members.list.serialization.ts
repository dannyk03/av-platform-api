import { IGroupMembersGetSerialization } from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GroupMembersListSerialization
  implements IGroupMembersGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  readonly role: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.profile?.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.profile?.lastName)
  readonly lastName: string;
}

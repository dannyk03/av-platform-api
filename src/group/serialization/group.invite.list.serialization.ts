import { EnumGroupInviteStatus, EnumGroupRole } from '@avo/type';

import { Exclude, Expose } from 'class-transformer';

// TODO from avotypes package
interface IGroupInviteGetSerialization {
  code: string;
  role?: EnumGroupRole;
  expiresAt?: Date;
  inviteStatus: EnumGroupInviteStatus;
}

@Exclude()
export class GroupInviteListSerialization
  implements IGroupInviteGetSerialization
{
  @Expose()
  inviteStatus: EnumGroupInviteStatus;

  @Expose()
  code: string;

  @Expose()
  role: EnumGroupRole;

  @Expose()
  expiresAt: Date;
}

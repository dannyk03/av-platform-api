import {
  EnumNetworkingConnectionRequestStatus,
  ISocialConnectionRequestGetSerialization,
} from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class SocialConnectionRequestGetSerialization
  implements ISocialConnectionRequestGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  @Transform(({ obj }) => obj.addressedUser?.email)
  readonly email: string;

  @Expose()
  @Transform(({ obj }) => obj.addressedUser?.profile?.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.addressedUser?.profile?.lastName)
  readonly lastName: string;

  @Expose()
  @Transform(({ obj }) => obj.addressedUser?.profile?.title)
  readonly title: string;

  @Expose()
  readonly status: EnumNetworkingConnectionRequestStatus;

  @Expose()
  readonly createdAt: Date;
}

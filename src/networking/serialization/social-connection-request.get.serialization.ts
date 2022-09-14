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
  @Transform(({ obj }) => obj.addresserUser?.id)
  readonly id: string;

  @Expose()
  @Transform(({ obj }) => obj.addresserUser?.email)
  readonly email: string;

  @Expose()
  @Transform(({ obj }) => obj.addresserUser?.profile?.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.addresserUser?.profile?.lastName)
  readonly lastName: string;

  @Expose()
  @Transform(({ obj }) => obj.addresserUser?.profile?.title)
  readonly title: string;

  @Expose()
  readonly status: EnumNetworkingConnectionRequestStatus;

  @Expose()
  readonly createdAt: Date;
}

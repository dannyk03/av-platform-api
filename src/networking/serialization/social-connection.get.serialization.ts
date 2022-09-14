import { ISocialConnectionGetSerialization } from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class SocialConnectionGetSerialization
  implements ISocialConnectionGetSerialization
{
  @Expose()
  @Transform(({ obj }) => obj.user2?.id)
  readonly id: string;

  @Expose()
  @Transform(({ obj }) => obj.user2?.email)
  readonly email: string;

  @Expose()
  @Transform(({ obj }) => obj.user2?.profile?.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.user2?.profile?.lastName)
  readonly lastName: string;

  @Expose()
  @Transform(({ obj }) => obj.user2?.profile?.title)
  readonly title: string;

  @Expose()
  readonly createdAt: Date;
}

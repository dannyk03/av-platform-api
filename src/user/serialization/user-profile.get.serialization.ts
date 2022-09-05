import { IUserProfileGetSerialization } from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

import { IAwsS3 } from '@/aws/type';

@Exclude()
export class UserProfileGetSerialization
  implements IUserProfileGetSerialization
{
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

  @Expose()
  @Transform(({ obj }) => obj.profile?.photo)
  readonly photo?: IAwsS3;

  @Expose()
  @Transform(({ obj }) => obj.profile?.city)
  readonly city?: string;

  @Expose()
  @Transform(({ obj }) => obj.profile?.state)
  readonly state?: string;

  @Expose()
  @Transform(({ obj }) => obj.profile?.country)
  readonly country?: string;

  @Expose()
  @Transform(({ obj }) => obj.profile?.personas)
  readonly personas?: object;

  @Expose()
  @Transform(({ obj }) => obj.profile?.dietary)
  readonly dietary?: object;
}

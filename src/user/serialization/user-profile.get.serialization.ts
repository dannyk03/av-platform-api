import {
  IUserProfileGetSerialization,
  IUserProfileHomeGetSerialization,
  IUserProfileShippingGetSerialization,
} from '@avo/type';

import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

import { IAwsS3 } from '@/aws/type';

@Exclude()
export class UserProfileHomeGetSerialization
  implements IUserProfileHomeGetSerialization
{
  @Expose()
  readonly city?: string;

  @Expose()
  readonly state?: string;

  @Expose()
  readonly country?: string;
}

@Exclude()
export class UserProfileShippingGetSerialization
  implements IUserProfileShippingGetSerialization
{
  @Expose()
  addressLine1?: string;

  @Expose()
  addressLine2?: string;

  @Expose()
  city?: string;

  @Expose()
  state?: string;

  @Expose()
  zipCode?: string;

  @Expose()
  country?: string;
}

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
  @Transform(({ obj }) =>
    plainToInstance(UserProfileHomeGetSerialization, obj?.profile?.home),
  )
  readonly home: IUserProfileHomeGetSerialization;

  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(
      UserProfileShippingGetSerialization,
      obj?.profile?.shipping,
    ),
  )
  readonly shipping: IUserProfileShippingGetSerialization;

  @Expose()
  @Transform(({ obj }) => obj.profile?.personas)
  readonly personas?: object;

  @Expose()
  @Transform(({ obj }) => obj.profile?.dietary)
  readonly dietary?: object;
}

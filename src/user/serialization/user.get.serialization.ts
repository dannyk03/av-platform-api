import {
  IUserAuthConfigGetSerialization,
  IUserGetSerialization,
  IUserOrganizationGetSerialization,
  IUserRoleGetSerialization,
} from '@avo/type';

import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { EnumUserSerializationGroup } from './constant';

@Exclude()
export class UserOrganizationGetSerialization
  implements IUserOrganizationGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly isActive: boolean;
}

@Exclude()
export class UserRoleGetSerialization implements IUserRoleGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly isActive: boolean;
}

@Exclude()
export class UserAuthConfigGetSerialization
  implements IUserAuthConfigGetSerialization
{
  @Expose()
  readonly emailVerifiedAt: Date;

  @Expose()
  readonly phoneVerifiedAt: Date;
}

@Exclude()
export class UserGetSerialization implements IUserGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose({ groups: [EnumUserSerializationGroup.System] })
  readonly phoneNumber: string;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose({ groups: [EnumUserSerializationGroup.System] })
  readonly updatedAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.profile?.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.profile?.lastName)
  readonly lastName: string;

  @Expose()
  @Transform(({ obj }) => obj.profile?.title)
  readonly title: string;

  @Expose()
  @Type(() => UserOrganizationGetSerialization)
  readonly organization: UserOrganizationGetSerialization;

  @Expose()
  @Type(() => UserRoleGetSerialization)
  readonly role: UserRoleGetSerialization;

  @Expose({ groups: [EnumUserSerializationGroup.System] })
  @Type(() => UserAuthConfigGetSerialization)
  readonly authConfig: UserAuthConfigGetSerialization;
}

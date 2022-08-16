import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { UserProfile } from '../entity';

// implements IUserOrganizationGetSerialization
@Exclude()
export class UserOrganizationGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly isActive: boolean;
}
@Exclude()
export class UserRoleGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly isActive: boolean;
}

@Exclude()
export class UserAuthConfigGetSerialization {
  @Expose()
  readonly emailVerifiedAt: Date;
}

// implements IUserGetSerialization
export class UserGetSerialization {
  readonly id: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
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

  @Type(() => UserOrganizationGetSerialization)
  readonly organization: UserOrganizationGetSerialization;

  @Type(() => UserRoleGetSerialization)
  readonly role: UserRoleGetSerialization;

  @Type(() => UserAuthConfigGetSerialization)
  readonly authConfig: UserAuthConfigGetSerialization;

  @Exclude()
  readonly deletedAt: Date;

  @Exclude()
  readonly profile: UserProfile;
}

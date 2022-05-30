import { Exclude, Transform, Type } from 'class-transformer';

export class UserGetSerialization {
  @Type(() => String)
  readonly _id: string;

  @Transform(
    ({ value }) => ({
      name: value.name,
      permissions: value.permissions.map((val: Record<string, any>) => ({
        name: val.name,
        isActive: val.isActive,
      })),
      isActive: value.isActive,
    }),
    { toClassOnly: true },
  )
  readonly email: string;
  readonly mobileNumber: string;
  readonly isActive: boolean;
  readonly firstName: string;
  readonly lastName: string;

  @Exclude()
  readonly password: string;

  readonly passwordExpired: Date;

  @Exclude()
  readonly salt: string;

  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}

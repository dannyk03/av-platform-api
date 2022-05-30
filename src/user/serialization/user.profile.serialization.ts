import { Exclude, Type } from 'class-transformer';

export class UserProfileSerialization {
  @Type(() => String)
  readonly _id: string;

  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly mobileNumber: string;

  @Exclude()
  readonly password: string;

  readonly passwordExpired: Date;

  @Exclude()
  readonly salt: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}

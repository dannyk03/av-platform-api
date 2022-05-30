import { Exclude, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UserListSerialization {
  @Type(() => String)
  readonly _id: string;

  @Exclude()
  readonly role: Types.ObjectId;

  readonly email: string;
  readonly mobileNumber: string;
  readonly isActive: boolean;
  readonly firstName: string;
  readonly lastName: string;

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly passwordExpired: Date;

  @Exclude()
  readonly salt: string;

  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}

import { Exclude, Type } from 'class-transformer';

export class AuthLoginSerialization {
  @Type(() => String)
  readonly _id: string;

  readonly email: string;
  readonly isActive: boolean;
  readonly passwordExpired: Date;
  readonly loginDate: Date;
  readonly rememberMe: boolean;

  @Exclude()
  readonly firstName: string;

  @Exclude()
  readonly lastName: string;

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly salt: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}

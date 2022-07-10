import { Exclude } from 'class-transformer';

export class AuthConfigLoginSerialization {
  @Exclude()
  readonly id: string;

  readonly passwordExpiredAt: Date;

  @Exclude()
  readonly emailVerifiedAt: Date;

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly salt: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}

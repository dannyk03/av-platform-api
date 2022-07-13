// import { Role } from '@/role/entity/role.entity';
import { Exclude, Type } from 'class-transformer';

export class UserListSerialization {
  @Type(() => String)
  readonly id: string;

  @Exclude()
  // readonly role: Role;
  readonly email: string;
  readonly phoneNumber: string;
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

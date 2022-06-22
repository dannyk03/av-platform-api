import { Organization } from '@/organization/entity/organization.entity';
import { AcpRoleAuthSerialization } from '@acp/role';
import { AcpRole } from '@acp/role/entity/acp-role.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AuthLoginSerialization {
  readonly id: string;

  @Transform(({ value: role }) =>
    plainToInstance(AcpRoleAuthSerialization, role),
  )
  readonly role: AcpRole;

  readonly email: string;
  readonly isActive: boolean;
  readonly passwordExpired: Date;
  readonly loginDate: Date;
  readonly rememberMe: boolean;

  @Exclude()
  readonly organization: Organization;

  @Exclude()
  readonly mobileNumber: string;

  @Exclude()
  readonly emailVerified: boolean;

  @Exclude()
  readonly emailVerificationToken: string;

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

  @Exclude()
  readonly deletedAt: Date;
}

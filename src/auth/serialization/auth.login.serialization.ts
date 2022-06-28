import { Organization } from '@/organization/entity/organization.entity';
import { OrganizationLoginSerialization } from '@/organization/serialization/organization.login.serialization';
import { AclRoleLoginSerialization } from '@acl/role';
import { AclRole } from '@acl/role/entity/acl-role.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AuthLoginSerialization {
  readonly id: string;

  readonly email: string;
  readonly isActive: boolean;
  readonly passwordExpired: Date;
  readonly loginDate: Date;
  readonly rememberMe: boolean;

  @Transform(({ value: organization }) =>
    plainToInstance(OrganizationLoginSerialization, organization),
  )
  readonly organization: Organization;

  @Transform(({ value: role }) =>
    plainToInstance(AclRoleLoginSerialization, role),
  )
  readonly role: AclRole;

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

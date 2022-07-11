import { Exclude, plainToInstance, Transform } from 'class-transformer';
// Entities
import { Organization } from '@/organization/entity/organization.entity';
import { UserAuthConfig } from '../entity/user-auth-config.entity';
import { AclRole } from '@acl/role/entity/acl-role.entity';
//
import { OrganizationLoginSerialization } from '@/organization/serialization/organization.login.serialization';
import { AclRoleLoginSerialization } from '@acl/role';
import { AuthConfigLoginSerialization } from './auth-config.login.serialization';

export class AuthUserLoginSerialization {
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

  @Transform(({ value: authConfig }) =>
    plainToInstance(AuthConfigLoginSerialization, authConfig),
  )
  readonly authConfig: UserAuthConfig;

  @Exclude()
  readonly mobileNumber: string;

  @Exclude()
  readonly firstName: string;

  @Exclude()
  readonly lastName: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
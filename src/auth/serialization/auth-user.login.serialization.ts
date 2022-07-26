import { AclRoleLoginSerialization } from '@acl/role';
import { AclRole } from '@acl/role/entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

import { Organization } from '@/organization/entity';
import { OrganizationLoginSerialization } from '@/organization/serialization/organization.login.serialization';

import { UserAuthConfig } from '../entity';
import { AuthConfigLoginSerialization } from './auth-config.login.serialization';

export class AuthUserLoginSerialization {
  readonly email: string;
  readonly isActive: boolean;
  readonly passwordExpired: Date;
  readonly loginDate: Date;
  readonly rememberMe: boolean;

  @Exclude()
  readonly id: string;

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
  readonly loginCode: string;

  @Exclude()
  readonly phoneNumber: string;

  @Exclude()
  readonly firstName: string;

  @Exclude()
  readonly lastName: string;

  @Exclude()
  readonly title: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}

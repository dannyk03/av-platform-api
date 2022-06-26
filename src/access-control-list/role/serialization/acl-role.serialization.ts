import { AclPolicySerialization } from '@acl/policy';
import { AclPolicy } from '@acl/policy/entity/acl-policy.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AclRoleSerialization {
  @Transform(({ value }) => plainToInstance(AclPolicySerialization, value))
  readonly policy: AclPolicy;

  readonly isActive: boolean;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}

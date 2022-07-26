import { AclPolicy } from '$acl/policy/entity';
import { Exclude } from 'class-transformer';

export class AclRoleLoginSerialization {
  readonly isActive: boolean;
  readonly name: boolean;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly slug: string;

  @Exclude()
  readonly policy: AclPolicy;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}

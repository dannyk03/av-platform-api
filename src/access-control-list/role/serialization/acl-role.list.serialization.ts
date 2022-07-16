import { AclPolicy } from '@/access-control-list/policy/entity';
import { Exclude } from 'class-transformer';

export class RoleListSerialization {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly isActive: boolean;

  @Exclude()
  readonly policy: AclPolicy;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}

import { AclPolicy } from '@/access-control-list/policy/entity';
import { Exclude } from 'class-transformer';

export class RoleListSerialization {
  readonly name: string;
  readonly slug: string;
  readonly isActive: boolean;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly policy: AclPolicy;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}

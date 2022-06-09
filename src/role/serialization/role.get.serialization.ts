import { Exclude, Transform, Type } from 'class-transformer';
import { Permission } from '@/permission/entity/permission.entity';

export class RoleGetSerialization {
  @Type(() => String)
  readonly id: string;

  readonly isActive: boolean;
  readonly name: string;
  readonly isAdmin: boolean;

  @Transform(
    ({ obj }) =>
      obj.permissions.map((val) => ({
        id: `${val.id}`,
        code: val.code,
        name: val.name,
        isActive: val.isActive,
      })),
    { toClassOnly: true },
  )
  readonly permissions: Permission[];

  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}

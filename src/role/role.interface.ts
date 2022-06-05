import { PermissionEntity } from '@/permission/entity/permission.entity';
import { RoleEntity } from './entity/role.entity';

export interface IRoleEntity extends Omit<RoleEntity, 'permissions'> {
  permissions: PermissionEntity[];
}

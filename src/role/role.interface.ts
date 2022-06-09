import { Permission } from '@/permission/entity/permission.entity';
import { Role } from './entity/role.entity';

export interface IRoleEntity extends Omit<Role, 'permissions'> {
  permissions: Permission[];
}

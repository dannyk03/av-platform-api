import { PermissionDocument } from '@/permission/schema/permission.schema';
import { RoleDocument } from './schema/role.schema';

export interface IRoleDocument extends Omit<RoleDocument, 'permissions'> {
    permissions: PermissionDocument[];
}

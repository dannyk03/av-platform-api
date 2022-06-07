export interface IPermission {
  slug: string;
  description?: string;
  isActive: boolean;
}

// export interface IPermissionCreate {
//   isActive?: boolean;
// }

export interface IPermissionCreate extends Omit<IPermission, 'isActive'> {
  isActive?: boolean;
}

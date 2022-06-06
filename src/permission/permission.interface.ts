export interface IPermission {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type IPermissionCreate = Omit<IPermission, 'code'>;

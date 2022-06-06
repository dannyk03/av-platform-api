export interface IPermission {
  slug: string;
  description?: string;
  isActive?: boolean;
}

export type IPermissionCreate = Omit<IPermission, 'code'>;

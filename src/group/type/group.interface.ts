import { EnumGroupInviteStatus } from '@avo/type';

import { IPaginationOptions } from '@/utils/pagination';

export enum EnumGroupInviteType {
  Income = 'income',
  Outcome = 'outcome',
}

export interface IGroupSearch {
  userId: string;
  search?: string;
  isActive?: boolean[];
  options?: IPaginationOptions;
}

export interface IGroupInviteSearch {
  userId: string;
  type: EnumGroupInviteType;
  status?: EnumGroupInviteStatus;
  search?: string;
  options?: IPaginationOptions;
}

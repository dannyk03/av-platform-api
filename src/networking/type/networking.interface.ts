import { EnumNetworkingConnectionRequestStatus } from '@avo/type';

import { IPaginationOptions } from '@/utils/pagination';

export interface ISocialConnectionRequestSearch {
  search?: string;
  status?: EnumNetworkingConnectionRequestStatus[];
  addresseeEmail: string;
  options?: IPaginationOptions;
  extraDataForAddressedUser?: boolean;
}
export interface ISocialConnectionSearch {
  search?: string;
  userEmail: string;
  options?: IPaginationOptions;
  extraDataForConnection?: boolean;
}

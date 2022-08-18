import { EnumNetworkingConnectionRequestStatus } from '@avo/type';

import { IPaginationOptions } from '@/utils/pagination';

export interface IConnectRequestSearch {
  search?: string;
  status?: EnumNetworkingConnectionRequestStatus[];
  addresseeEmail: string;
  options?: IPaginationOptions;
  extraDataForAddressedUser?: boolean;
}

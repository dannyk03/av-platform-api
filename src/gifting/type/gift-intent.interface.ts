import { EnumDisplayLanguage } from '@avo/type';

import { IPaginationOptions } from '@/utils/pagination/pagination.interface';

export interface IGiftIntentSearch {
  ownerId?: string;
  search?: string;
  loadExtra?: boolean;
  options?: IPaginationOptions;
  lang?: EnumDisplayLanguage;
}

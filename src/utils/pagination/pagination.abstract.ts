import { IPaginationSort } from './pagination.interface';

import { EnumDisplayLanguage } from '@/language/display-language';

export abstract class PaginationListAbstract {
  abstract search?: string;
  abstract keywords?: string[];
  abstract lang?: EnumDisplayLanguage;
  abstract availableSearch: string[];
  abstract page: number;
  abstract perPage: number;
  abstract sort: IPaginationSort;
  abstract availableSort: string[];
}

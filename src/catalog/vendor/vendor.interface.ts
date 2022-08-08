import { IPaginationOptions } from '@/utils/pagination';

export interface ICreateLogo {
  logo: Express.Multer.File;
  subFolder?: string;
}

export interface IVendorSearch {
  search?: string;
  isActive?: boolean[];
  loadLogos?: boolean;
  options?: IPaginationOptions;
}

export interface IVendorUpdate {
  id: string;
  description?: string;
  isActive?: boolean;
}

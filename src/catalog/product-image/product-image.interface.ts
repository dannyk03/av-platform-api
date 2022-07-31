import { EnumDisplayLanguage } from '@/language/display-language';

export interface ICreateImages {
  images: Express.Multer.File[];
  language: EnumDisplayLanguage;
}

export interface ISaveImages extends ICreateImages {
  id: string;
}

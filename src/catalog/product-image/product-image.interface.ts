import { EnumDisplayLanguage } from '@avo/type';

export interface ICreateImages {
  images: Express.Multer.File[];
  language: EnumDisplayLanguage;
  subFolder?: string;
}

export interface ISaveImages extends ICreateImages {
  id: string;
}

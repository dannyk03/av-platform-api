import { EnumDisplayLanguage } from '@avo/type';

export interface ICreateImages {
  images: Express.Multer.File[];
  language: EnumDisplayLanguage;
}

export interface ISaveImages extends ICreateImages {
  id: string;
}

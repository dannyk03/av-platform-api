import { DisplayLanguageCodeType } from '@/language/display-language/display-language.constant';

export interface UploadProductImage {
  file: Express.Multer.File;
  language: DisplayLanguageCodeType;
}

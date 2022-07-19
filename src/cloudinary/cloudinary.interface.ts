import { EnumDisplayLanguage } from '@/language/display-language';
import { CloudinarySubject } from './cloudinary.constants';

export interface UploadCloudinaryImage {
  image: Express.Multer.File;
  subject: CloudinarySubject;
  languageIsoCode: EnumDisplayLanguage;
}

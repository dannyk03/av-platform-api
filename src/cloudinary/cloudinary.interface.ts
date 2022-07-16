import { DisplayLanguageCodeType } from '@/language/display-language/display-language.constant';
import { CloudinarySubject } from './cloudinary.constants';

export interface UploadCloudinaryImage {
  image: Express.Multer.File;
  subject: CloudinarySubject;
  languageIsoCode: DisplayLanguageCodeType;
}

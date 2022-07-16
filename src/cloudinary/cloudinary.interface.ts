import { DisplayLanguageCodeType } from '@/language/display-language/display-language.constant';
import { CloudinarySubject } from './cloudinary.constants';

export interface UploadCloudinaryImage {
  file: Express.Multer.File;
  subject: CloudinarySubject;
  language?: DisplayLanguageCodeType;
}

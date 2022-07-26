import { EnumDisplayLanguage } from '@/language/display-language';

import { CloudinarySubject } from './cloudinary.constant';

export interface UploadCloudinaryImage {
  image: Express.Multer.File;
  subject: CloudinarySubject;
  languageIsoCode: EnumDisplayLanguage;
}

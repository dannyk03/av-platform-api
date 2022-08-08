import { EnumDisplayLanguage } from '@avo/type';

import { CloudinarySubject } from './cloudinary.constant';

export interface UploadCloudinaryImage {
  image: Express.Multer.File;
  subject: CloudinarySubject;
  languageIsoCode: EnumDisplayLanguage;
}

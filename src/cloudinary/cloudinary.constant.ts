import pluralize from 'pluralize';

export const CLOUDINARY = 'Cloudinary';

const ROOT_FOLDER = 'platform';

export enum CloudinarySubject {
  Product = 'product',
  Vendor = 'vendor',
}

export const CloudinarySubjectFolderPath = Object.freeze({
  global: {
    [CloudinarySubject.Vendor]: `${ROOT_FOLDER}/global/${pluralize(
      CloudinarySubject.Vendor,
    )}`,
  },
  en: {
    [CloudinarySubject.Product]: `${ROOT_FOLDER}/en/${pluralize(
      CloudinarySubject.Product,
    )}`,
  },
});

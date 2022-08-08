import pluralize from 'pluralize';

export const CLOUDINARY = 'Cloudinary';

const ROOT_FOLDER = 'platform';

export enum CloudinarySubject {
  Product = 'product',
  Vendor = 'vendor',
}

export const CloudinarySubjectFolderPath = Object.freeze({
  en: {
    [CloudinarySubject.Product]: `${ROOT_FOLDER}/en/${pluralize(
      CloudinarySubject.Product,
    )}`,
    [CloudinarySubject.Vendor]: `${ROOT_FOLDER}/en/${pluralize(
      CloudinarySubject.Vendor,
    )}`,
  },
});

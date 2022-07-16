import pluralize from 'pluralize';

const ROOT_FOLDER = 'platform';

export enum CloudinarySubject {
  Product = 'product',
}

export const CloudinaryFolder = Object.freeze({
  en: {
    [CloudinarySubject.Product]: `${ROOT_FOLDER}/en/${pluralize(
      CloudinarySubject.Product,
    )}`,
  },
});

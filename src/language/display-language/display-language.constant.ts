import ISO6391 from 'iso-639-1';

export enum EnumDisplayLanguage {
  En = 'en',
}

export type DisplayLanguageCodeType = keyof typeof EnumDisplayLanguage;

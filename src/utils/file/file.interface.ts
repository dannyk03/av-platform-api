import { ClassConstructor } from 'class-transformer';

import { EnumFileType } from './file.constant';

export type IFile = Express.Multer.File;

export interface IFileOptions {
  type?: EnumFileType;
  required?: boolean;
  extract?: boolean;
  dto?: ClassConstructor<any>;
}

export interface IFileImageOptions {
  required?: boolean;
}

export interface IFileAudioOptions {
  required?: boolean;
}

export interface IFileVideoOptions {
  required?: boolean;
}

export interface IFileExcelOptions {
  required?: boolean;
  extract?: boolean;
  dto?: ClassConstructor<any>;
}

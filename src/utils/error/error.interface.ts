import { IErrors } from '@avo/type';

import { ValidationError } from 'class-validator';

import { IMessageOptionsProperties } from '@/response-message';

export interface IErrorsImport {
  row: number;
  file?: string;
  errors: IErrors[];
}

export interface IValidationErrorImport {
  row: number;
  file?: string;
  errors: ValidationError[];
}

export interface IErrorException {
  statusCode: number;
  message: string;
  cause?: string;
  errors?: ValidationError[] | IValidationErrorImport[];
  errorFromImport?: boolean;
  data?: Record<string, any>;
  properties?: IMessageOptionsProperties;
}

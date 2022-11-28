import { IErrors } from '@avo/type';

import { ValidationError } from 'class-validator';

import { EnumErrorType } from '../constant';

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

// error exception
export interface IErrorException {
  silent: boolean;
  detailed: boolean;
  statusCode: number;
  message: string;
  error?: string;
  errors?: ValidationError[] | IValidationErrorImport[];
  errorType?: EnumErrorType;
  metadata?: Record<string, any>;
  data?: Record<string, any>;
  properties?: IMessageOptionsProperties;
}

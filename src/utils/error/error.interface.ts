import { IErrors, IMessage } from '@avo/type';

import { ValidationError } from 'class-validator';

import { IMessageOptionsProperties } from '@/response-message';

import { EnumErrorType } from './error.constant';

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
  statusCode: number;
  message: string;
  error?: string;
  errors?: ValidationError[] | IValidationErrorImport[];
  errorType?: EnumErrorType;
  metadata?: Record<string, any>;
  data?: Record<string, any>;
  properties?: IMessageOptionsProperties;
}

// final error
export interface IErrorHttpFilterMetadata {
  languages?: string[];
  timestamp: number;
  timezone: string;
  correlationId: string;
  path: string;
  version: string;
  repoVersion: string;
  [key: string]: any;
}

export interface IErrorHttpFilter {
  statusCode: number;
  message: string | IMessage;
  error?: string;
  errors?: IErrors[] | IErrorsImport[];
  metadata: IErrorHttpFilterMetadata;
  data?: Record<string, any>;
}

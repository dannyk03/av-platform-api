import { ClassConstructor } from 'class-transformer';

import { IMessageOptionsProperties } from '@/response-message';
import { EnumPaginationType } from '@/utils/pagination';

export interface IResponsePagingOptions {
  statusCode?: number;
  type?: EnumPaginationType;
}

export interface IResponseOptions {
  classSerialization: ClassConstructor<any>;
  messageProperties?: IMessageOptionsProperties;
}

export interface IResponseMetadata {
  statusCode?: number;
  message?: string;
  messageProperties?: IMessageOptionsProperties;
  [key: string]: any;
}

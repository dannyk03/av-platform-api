import { ClassConstructor } from 'class-transformer';

import { IMessageOptionsProperties } from '@/response-message';

import { EnumPaginationType } from '../pagination';

export interface IResponsePagingOptions {
  statusCode?: number;
  type?: EnumPaginationType;
}

export interface IResponseOptions {
  classSerialization: ClassConstructor<any>;
  messageProperties?: IMessageOptionsProperties;
}

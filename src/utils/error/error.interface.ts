import { IMessageOptionsProperties } from '@/response-message/response-message.interface';

export interface IErrors {
  readonly message: string;
  readonly property: string;
}

export interface IErrorException {
  statusCode: number;
  message: string;
  errors?: IErrors[];
  data?: Record<string, any>;
  properties?: IMessageOptionsProperties;
}

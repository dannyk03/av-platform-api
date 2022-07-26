import { IMessage, IMessageOptionsProperties } from '$/response-message';

export interface IErrors {
  readonly message: string | IMessage;
  readonly property: string;
}

export interface IErrorException {
  statusCode: number;
  message: string;
  errors?: IErrors[];
  data?: Record<string, any>;
  properties?: IMessageOptionsProperties;
}

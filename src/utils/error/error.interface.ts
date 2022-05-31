import { IMessageOptionsProperties } from '@/message/message.interface';

export interface IErrors {
    readonly message: string;
    readonly property: string;
}

export interface IErrorException {
    statusCode: number;
    message: string;
    errors?: IErrors[];
    error?: IErrors;
    data?: Record<string, any>;
    properties?: IMessageOptionsProperties;
}
import { AuthApiCreateDto } from './dto/auth.api.create.dto';

export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpired: Date;
}

export interface IAuthPayloadOptions {
  loginDate: Date;
}

export interface IAuthApiPayload {
  id: string;
  key: string;
  name: string;
  description: string;
}

export interface IAuthApiEntity {
  id: string;
  secret: string;
  passphrase: string;
  encryptionKey: string;
}

export interface IAuthApiCreate extends AuthApiCreateDto {
  key?: string;
  secret?: string;
  passphrase?: string;
  encryptionKey?: string;
}

export interface IAuthApiRequestHashedData {
  key: string;
  timestamp: number;
  hash: string;
}

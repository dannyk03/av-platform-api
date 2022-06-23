export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpired: Date;
}

export interface IAuthPayloadOptions {
  loginDate: Date;
}

export interface IAuthApiRequestHashedData {
  key: string;
  timestamp: number;
  hash: string;
}

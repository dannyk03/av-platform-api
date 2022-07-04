export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpiredAt: Date;
}

export interface IAuthPayloadOptions {
  loginDate: Date;
}

export interface IAuthApiRequestHashedData {
  key: string;
  timestamp: number;
  hash: string;
}

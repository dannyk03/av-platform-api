import { IReqAclAbility } from '$acl/acl.interface';

export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpiredAt: Date;
}

export interface IAuthPayloadOptions {
  loginDate: Date;
}
export interface IAuthMagicLoginOptions {
  guest: boolean;
}

export interface IAuthApiRequestHashedData {
  key: string;
  timestamp: number;
  hash: string;
}

export interface IAclGuard {
  abilities?: IReqAclAbility[];
  systemOnly?: boolean;
  verifiedOnly?: boolean;
  relations?: string[];
  loadSensitiveAuthData?: boolean;
}

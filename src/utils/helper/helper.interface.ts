import { ConfigType } from 'dayjs';

import { EnumHelperDateDiff, EnumHelperDateFormat } from './helper.constant';

export interface IHelperJwtOptions {
  expiredIn: string;
  notBefore?: string;
  secretKey: string;
}

export interface IHelperJwtVerifyOptions {
  secretKey: string;
}

export interface IHelperStringRandomOptions {
  upperCase?: boolean;
  safe?: boolean;
  prefix?: string;
}

export interface IHelperGeoCurrent {
  latitude: number;
  longitude: number;
}

export interface IHelperGeoRules extends IHelperGeoCurrent {
  radiusInMeters: number;
}

export interface IHelperDateOptions {
  timezone?: string;
}

export interface IHelperDateOptionsDiff extends IHelperDateOptions {
  format?: EnumHelperDateDiff;
}

export interface IHelperDateOptionsCreate extends IHelperDateOptions {
  date?: ConfigType;
}

export interface IHelperDateOptionsFormat extends IHelperDateOptions {
  format?: EnumHelperDateFormat | string;
}

export interface IHelperDateOptionsForward extends IHelperDateOptions {
  fromDate?: Date;
}

export type IHelperDateOptionsBackward = IHelperDateOptionsForward;

export interface IHelperDateOptionsMonth extends IHelperDateOptions {
  year?: number;
}

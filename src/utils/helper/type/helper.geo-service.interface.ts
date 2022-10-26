import { IHelperGeoCurrent, IHelperGeoRules } from '../helper.interface';

export interface IHelperGeoService {
  inRadius(geoRule: IHelperGeoRules, geoCurrent: IHelperGeoCurrent): boolean;
}

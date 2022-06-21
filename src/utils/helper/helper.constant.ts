export enum EnumHelperDateFormat {
  Date = 'YYYY-MM-DD',
  FriendlyDate = 'MMM, DD YYYY',
  FriendlyDateTime = 'MMM, DD YYYY HH:MM:SS',
  YearMonth = 'YYYY-MM',
  MonthDate = 'MM-DD',
  OnlyYear = 'YYYY',
  OnlyMonth = 'MM',
  OnlyDate = 'DD',
  IsoDate = 'YYYY-MM-DDTHH:MM:SSZ',
}

export interface IHelperDateFormatOptions {
  timezone?: string;
  format?: EnumHelperDateFormat | string;
}

export enum EnumHelperDateDiff {
  Milis = 'milis',
  Seconds = 'seconds',
  Hours = 'hours',
  Days = 'days',
  Minutes = 'minutes',
}

import { Injectable } from '@nestjs/common';
import { isNumber, isString } from '@nestjs/common/utils/shared.utils';
import { ConfigService } from '@nestjs/config';

import dayjs, { ConfigType } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import moment from 'moment-timezone';

import { EnumHelperDateDiff, EnumHelperDateFormat } from '../helper.constant';

import {
  IHelperDateOptions,
  IHelperDateOptionsBackward,
  IHelperDateOptionsCreate,
  IHelperDateOptionsDiff,
  IHelperDateOptionsFormat,
  IHelperDateOptionsForward,
  IHelperDateOptionsMonth,
} from '../helper.interface';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

@Injectable()
export class HelperDateService {
  private readonly timezone: string;
  constructor(private readonly configService: ConfigService) {
    const appTimezone = this.configService.get<string>('app.timezone');
    this.timezone = appTimezone;
    dayjs.tz.setDefault(appTimezone);
  }

  calculateAge(dateOfBirth: Date, options?: IHelperDateOptions): number {
    return moment.tz(options?.timezone).diff(dateOfBirth, 'years');
  }

  diff(dateOne: Date, dateTwo: Date, options?: IHelperDateOptionsDiff): number {
    const mDateOne = moment.tz(dateOne, options?.timezone);
    const mDateTwo = moment.tz(dateTwo, options?.timezone);
    const diff = moment.duration(mDateTwo.diff(mDateOne));

    if (options?.format === EnumHelperDateDiff.Milis) {
      return diff.asMilliseconds();
    } else if (options?.format === EnumHelperDateDiff.Seconds) {
      return diff.asSeconds();
    } else if (options?.format === EnumHelperDateDiff.Hours) {
      return diff.asHours();
    } else if (options?.format === EnumHelperDateDiff.Minutes) {
      return diff.asMinutes();
    } else {
      return diff.asDays();
    }
  }

  check(date: ConfigType, options?: IHelperDateOptions): boolean {
    return dayjs(date)
      .tz(options?.timezone || this.timezone)
      .isValid();
  }

  checkTimezone(tz: string): boolean {
    return dayjs().tz(tz).isValid();
  }

  create(options?: IHelperDateOptionsCreate): Date {
    const date = options?.date;
    if ((isString(date) || isNumber(date)) && date.toString().length === 10) {
      return dayjs.unix(Number(date)).tz(options?.timezone).toDate();
    }

    return dayjs(options?.date).tz(options?.timezone).toDate();
  }

  timestamp(options?: IHelperDateOptionsCreate): number {
    return moment.tz(options?.date, options?.timezone).valueOf();
  }

  format(date: Date, options?: IHelperDateOptionsFormat): string {
    return moment
      .tz(date, options?.timezone)
      .format(options?.format || EnumHelperDateFormat.Date);
  }

  forwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsForward,
  ): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .add(milliseconds, 'ms')
      .toDate();
  }

  backwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .subtract(milliseconds, 'ms')
      .toDate();
  }

  forwardInSeconds(seconds: number, options?: IHelperDateOptionsForward): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .add(seconds, 's')
      .toDate();
  }

  backwardInSeconds(
    seconds: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .subtract(seconds, 's')
      .toDate();
  }

  forwardInMinutes(minutes: number, options?: IHelperDateOptionsForward): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .add(minutes, 'm')
      .toDate();
  }

  backwardInMinutes(
    minutes: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .subtract(minutes, 'm')
      .toDate();
  }

  forwardInDays(days: number, options?: IHelperDateOptionsForward): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .add(days, 'd')
      .toDate();
  }

  backwardInDays(days: number, options?: IHelperDateOptionsBackward): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .subtract(days, 'd')
      .toDate();
  }

  forwardInMonths(months: number, options?: IHelperDateOptionsForward): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .add(months, 'M')
      .toDate();
  }

  backwardInMonths(months: number, options?: IHelperDateOptionsBackward): Date {
    return moment
      .tz(options?.fromDate, options?.timezone)
      .subtract(months, 'M')
      .toDate();
  }

  endOfMonth(month: number, options?: IHelperDateOptionsMonth): Date {
    const year = options?.year
      ? options.year
      : moment.tz(options?.timezone).year();
    return moment
      .tz(options?.timezone)
      .year(year)
      .month(month - 1)
      .endOf('month')
      .toDate();
  }

  startOfMonth(month: number, options?: IHelperDateOptionsMonth): Date {
    const year = options?.year
      ? options.year
      : moment.tz(options?.timezone).year();
    return moment
      .tz(options?.timezone)
      .year(year)
      .month(month - 1)
      .startOf('month')
      .toDate();
  }

  endOfYear(year: number, options?: IHelperDateOptions): Date {
    return moment.tz(options?.timezone).year(year).endOf('year').toDate();
  }

  startOfYear(year: number, options?: IHelperDateOptions): Date {
    return moment.tz(options?.timezone).year(year).startOf('year').toDate();
  }

  startOfDay(date?: Date, options?: IHelperDateOptions): Date {
    return moment.tz(date, options?.timezone).startOf('day').toDate();
  }

  endOfDay(date?: Date, options?: IHelperDateOptions): Date {
    return moment.tz(date, options?.timezone).endOf('day').toDate();
  }
}

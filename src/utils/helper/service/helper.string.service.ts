import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { isEmail } from 'class-validator';

import { IHelperStringService } from '../type/helper.string-service.interface';

import { IHelperStringRandomOptions } from '../helper.interface';

@Injectable()
export class HelperStringService implements IHelperStringService {
  checkEmail(email: string): boolean {
    return isEmail(email);
  }

  randomReference(length: number, prefix?: string): string {
    const timestamp = `${new Date().valueOf()}`;
    const randomString: string = this.random(length, {
      safe: true,
      upperCase: true,
    });

    return prefix
      ? `${prefix}-${timestamp}${randomString}`
      : `${timestamp}${randomString}`;
  }

  random(length: number, options?: IHelperStringRandomOptions): string {
    const rString = options?.safe
      ? faker.internet.password(length, true, /[A-Z]/, options?.prefix)
      : faker.internet.password(length, false, /\w/, options?.prefix);

    return options?.upperCase ? rString.toUpperCase() : rString;
  }

  censor(value: string): string {
    const length = value.length;
    if (length === 1) {
      return value;
    }

    const end = length > 4 ? length - 4 : 1;
    const censorString = '*'.repeat(end > 10 ? 10 : end);
    const visibleString = value.substring(end, length);
    return `${censorString}${visibleString}`;
  }

  checkStringOrNumber(text: string) {
    const regex = new RegExp(/^[\w.-]+$/);

    return regex.test(text);
  }

  convertStringToNumberOrBooleanIfPossible(
    text: string,
  ): string | number | boolean {
    let convertValue: string | boolean | number = text;

    const regexNumber = /^-?\d+$/;
    if (text === 'true' || text === 'false') {
      convertValue = text === 'true';
    } else if (regexNumber.test(text)) {
      convertValue = Number(text);
    }

    return convertValue;
  }

  checkPasswordWeak(password: string, length?: number): boolean {
    const regex = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z]).{${length || 8},}$`);

    return regex.test(password);
  }

  checkPasswordMedium(password: string, length?: number): boolean {
    const regex = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{${length || 8},}$`,
    );

    return regex.test(password);
  }

  checkPasswordStrong(password: string, length?: number): boolean {
    const regex = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${
        length || 8
      },}$`,
    );

    return regex.test(password);
  }

  checkSafeString(text: string): boolean {
    const regex = /'^[A-Za-z0-9_-]+$'/;
    return regex.test(text);
  }

  tsQueryParam(text: string): string {
    return text
      .trim()
      .replace?.(/\s+/g, ' ')
      .split(' ')
      .map((word) => `${word}:*`)
      .join(' & ');
  }
}

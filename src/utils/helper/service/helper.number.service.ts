import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { IHelperNumberService } from '../type/helper.number-service.interface';

@Injectable()
export class HelperNumberService implements IHelperNumberService {
  check(number: string): boolean {
    const regex = /^-?\d+$/;
    return regex.test(number);
  }

  create(number: string): number {
    return Number(number);
  }

  random(length: number): number {
    const min: number = Number.parseInt(`1`.padEnd(length, '0'));
    const max: number = Number.parseInt(`9`.padEnd(length, '9'));
    return this.randomInRange(min, max);
  }

  randomInRange(min: number, max: number): number {
    return faker.datatype.number({ min, max });
  }
}

import { Injectable } from '@nestjs/common';

import { IHelperPromiseService } from '../type/helper.promise.interface';

@Injectable()
export class HelperPromiseService implements IHelperPromiseService {
  async mapPromiseBasedResultToResponseReport(
    result: PromiseSettledResult<string>[],
  ) {
    return result.reduce((acc, promiseValue) => {
      if ('value' in promiseValue) {
        acc[promiseValue.value] = 'success';
      } else if ('reason' in promiseValue) {
        acc[promiseValue.reason] = 'fail';
      }
      return acc;
    }, {});
  }
}

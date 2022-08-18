import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperPromiseService {
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

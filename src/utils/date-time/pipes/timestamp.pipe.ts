import {
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';

import { EnumRequestStatusCodeError } from '@avo/type';

import { isRFC3339 } from 'class-validator';

import { HelperDateService } from '@/utils/helper/service';

export function TimestampPipe(
  defaultForwardInDays?: number,
): Type<PipeTransform<string, number>> {
  @Injectable()
  class TimestampPipe implements PipeTransform<string, number> {
    constructor(private readonly helperDateService: HelperDateService) {}

    transform(value: any): number {
      if (value && !isRFC3339(value)) {
        throw new BadRequestException({
          statusCode: EnumRequestStatusCodeError.RequestValidationError,
          message: 'http.clientError.unprocessableQueryStringParam',
        });
      }

      const timestamp = defaultForwardInDays
        ? this.helperDateService.timestamp({
            date: this.helperDateService.forwardInDays(defaultForwardInDays),
          })
        : this.helperDateService.timestamp();

      return timestamp;
    }
  }

  return TimestampPipe;
}

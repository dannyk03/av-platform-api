import { Injectable, PipeTransform, Type, mixin } from '@nestjs/common';

import { HelperDateService } from '@/utils/helper/service';

export function RequestAddDatePipe(days: number): Type<PipeTransform> {
  @Injectable()
  class MixinRequestAddDatePipe implements PipeTransform {
    constructor(private readonly helperDateService: HelperDateService) {}

    async transform(value: any) {
      // no need timezone because convert a date
      return this.helperDateService.forwardInDays(days, {
        fromDate: this.helperDateService.create({
          date: value,
        }),
      });
    }
  }

  return mixin(MixinRequestAddDatePipe);
}

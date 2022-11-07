import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';

import { IResponseData } from '@avo/type';

import { HelperDateService } from '@/utils/helper/service';

import { RequestTimezone } from '@/utils/request/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { EnumHelperDateFormat } from '@/utils/helper';

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppCommonController {
  constructor(
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {}

  @ClientResponse('app.global')
  @HttpCode(HttpStatus.OK)
  @Throttle(1, 5)
  @Get()
  async global(
    @RequestTimezone()
    timezone: string,
  ): Promise<IResponseData> {
    const newDate = this.helperDateService.create({
      timezone: timezone,
    });

    return {
      date: newDate,
      format: this.helperDateService.format(newDate, {
        timezone: timezone,
        format: EnumHelperDateFormat.FriendlyDateTime,
      }),
    };
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { IResult } from 'ua-parser-js';

import { CloudinaryService } from '@/cloudinary/service';
import { HelperDateService, HelperService } from '@/utils/helper/service';

import { AclGuard, ReqJwtUser } from '@/auth';
import { ErrorMeta } from '@/utils/error';
import { EnumHelperDateFormat } from '@/utils/helper';
import { RequestTimezone, RequestUserAgent } from '@/utils/request';
import { IResponse, Response, ResponseTimeout } from '@/utils/response';

@Throttle(1, 5)
@Controller({
  version: VERSION_NEUTRAL,
})
export class TestingCommonController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly helperService: HelperService,
    private readonly helperDateService: HelperDateService,
  ) {}
  @Response('test.ping')
  @HttpCode(HttpStatus.OK)
  @Get()
  async hello(
    @RequestUserAgent() userAgent: IResult,
    @RequestTimezone() timezone: string,
  ): Promise<IResponse> {
    const newDate = this.helperDateService.create({
      timezone: timezone,
    });
    return {
      userAgent,
      date: newDate,
      format: this.helperDateService.format(newDate, {
        timezone: timezone,
      }),
      timestamp: this.helperDateService.timestamp({
        date: newDate,
        timezone: timezone,
      }),
    };
  }

  @Response('test.auth')
  @HttpCode(HttpStatus.OK)
  @AclGuard({ systemOnly: true })
  @Get('/auth')
  async helloAuth(
    @RequestUserAgent() userAgent: IResult,
    @RequestTimezone() timezone: string,
    @ReqJwtUser() user,
  ): Promise<IResponse> {
    const newDate = this.helperDateService.create({
      timezone: timezone,
    });
    return {
      userAgent,
      date: newDate,
      format: this.helperDateService.format(newDate, {
        timezone: timezone,
        format: EnumHelperDateFormat.FriendlyDateTime,
      }),
      timestamp: this.helperDateService.timestamp({
        date: newDate,
        timezone: timezone,
      }),
      loginDate: {
        date: user.loginDate,
        format: this.helperDateService.format(user.loginDate, {
          timezone: timezone,
          format: EnumHelperDateFormat.FriendlyDateTime,
        }),
      },
      passwordExpiredAt: {
        date: user.authConfig?.passwordExpiredAt,
        format: this.helperDateService.format(
          user.authConfig?.passwordExpiredAt,
          {
            timezone: timezone,
            format: EnumHelperDateFormat.FriendlyDateTime,
          },
        ),
      },
      role: user.role?.name,
    };
  }

  @Response('test.timeout')
  @ResponseTimeout('2s')
  @ErrorMeta(TestingCommonController.name, 'helloTimeoutCustom')
  @Get('/timeout')
  async timeout(): Promise<IResponse> {
    await this.helperService.delay(5000);
    return;
  }

  // @Response('test.cld')
  // @HttpCode(HttpStatus.OK)
  // @Get('/cld')
  // async cld(): Promise<IResponse> {
  //   await this.cloudinaryService.list();
  //   return;
  // }
}

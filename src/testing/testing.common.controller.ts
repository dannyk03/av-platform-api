import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { IResponseData } from '@avo/type';

import { IResult } from 'ua-parser-js';

import { CloudinaryService } from '@/cloudinary/service';
import { HelperDateService, HelperService } from '@/utils/helper/service';

import { AclGuard } from '@/auth';
import { EnumLogAction, LogTrace } from '@/log';
import { ReqUser } from '@/user';
import { ErrorMeta } from '@/utils/error';
import { EnumHelperDateFormat } from '@/utils/helper';
import { RequestTimezone, RequestUserAgent } from '@/utils/request';
import { Response, ResponseTimeout } from '@/utils/response';

@Throttle(1, 10)
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
  @LogTrace(EnumLogAction.Test, { tags: ['test'] })
  @Get()
  async hello(
    @RequestUserAgent() userAgent: IResult,
    @RequestTimezone() timezone: string,
  ): Promise<IResponseData> {
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
    };
  }

  @Response('test.auth')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/auth')
  async helloAuth(
    @RequestUserAgent() userAgent: IResult,
    @RequestTimezone() timezone: string,
    @ReqUser() user,
  ): Promise<IResponseData> {
    const newDate = this.helperDateService.create({
      timezone,
    });
    return {
      userAgent,
      date: newDate,
      format: this.helperDateService.format(newDate, {
        format: EnumHelperDateFormat.FriendlyDateTime,
        timezone,
      }),
      timestamp: this.helperDateService.timestamp({
        date: newDate,
        timezone,
      }),
      loginDate: {
        date: user.loginDate,
        format: this.helperDateService.format(user.loginDate, {
          format: EnumHelperDateFormat.FriendlyDateTime,
          timezone,
        }),
      },
      passwordExpiredAt: {
        date: user.authConfig?.passwordExpiredAt,
        format: this.helperDateService.format(
          user.authConfig?.passwordExpiredAt,
          {
            format: EnumHelperDateFormat.FriendlyDateTime,
            timezone,
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
  async timeout(): Promise<IResponseData> {
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

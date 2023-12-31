import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';

import { EnumRequestStatusCodeError, IResponseData } from '@avo/type';

import { IResult } from 'ua-parser-js';

import { LogService } from '@/log/service';
import { HelperDateService, HelperService } from '@/utils/helper/service';

import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ExecMeta,
  RequestTimezone,
  RequestUserAgent,
} from '@/utils/request/decorator';
import { ClientResponse, ResponseTimeout } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { EnumLogAction } from '@/log/constant';

import { EnumHelperDateFormat } from '@/utils/helper';

@Throttle(1, 10)
@Controller({
  version: VERSION_NEUTRAL,
})
export class TestingCommonController {
  constructor(
    private readonly helperService: HelperService,
    private readonly helperDateService: HelperDateService,
    private readonly logService: LogService,
    private readonly configService: ConfigService,
  ) {}
  @ClientResponse('test.ping')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.Test, { tags: ['test'] })
  @Get()
  async test(
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
    };
  }

  @ClientResponse('test.auth')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/auth')
  async helloAuth(
    @RequestUserAgent() userAgent: IResult,
    @RequestTimezone() timezone: string,
    @ReqAuthUser() reqUser,
  ): Promise<IResponseData> {
    const newDate = this.helperDateService.create({
      timezone,
    });
    return {
      id: reqUser.id,
      email: reqUser.email,
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
        date: reqUser.loginDate,
        format: this.helperDateService.format(reqUser.loginDate, {
          format: EnumHelperDateFormat.FriendlyDateTime,
          timezone,
        }),
      },
      passwordExpiredAt: {
        date: reqUser.authConfig?.passwordExpiredAt,
        format: this.helperDateService.format(
          reqUser.authConfig?.passwordExpiredAt,
          {
            format: EnumHelperDateFormat.FriendlyDateTime,
            timezone,
          },
        ),
      },
      role: reqUser.role?.name,
    };
  }

  @ClientResponse('test.timeout')
  @ResponseTimeout('2s')
  @ExecMeta(TestingCommonController.name, 'helloTimeoutCustom')
  @Get('/timeout')
  async timeout(): Promise<IResponseData> {
    await this.helperService.delay(5000);
    return;
  }

  @ClientResponse('response.default')
  @ResponseTimeout('2s')
  @ExecMeta(TestingCommonController.name, 'errorTestCustomFunc')
  @Get('/error')
  async errorTest(): Promise<void> {
    throw new UnprocessableEntityException({
      statusCode: EnumRequestStatusCodeError.RequestValidationError,
      message: 'http.clientError.unprocessableEntity',
      error: 'Test error message',
    });
  }

  @ClientResponse('response.test.withProps', {
    messageProperties: { prop1: 'test1', prop2: 'test2' },
    classSerialization: null,
  })
  @Get('/log')
  async logTest(): Promise<void> {
    this.logService.error({
      action: EnumLogAction.Test,
      description: 'Test error log',
      tags: ['test'],
      data: { error: 'some error' },
    });
  }
}

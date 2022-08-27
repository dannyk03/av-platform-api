import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { EnumRequestStatusCodeError, IResponseData } from '@avo/type';

import { IResult } from 'ua-parser-js';

import { CloudinaryService } from '@/cloudinary/service';
import { LogService } from '@/log/service';
import { HelperDateService, HelperService } from '@/utils/helper/service';

import { LogTrace } from '@/log/decorators';
import { ReqUser } from '@/user/decorators';
import { ErrorMeta } from '@/utils/error/decorators';
import {
  ReqLogData,
  RequestTimezone,
  RequestUserAgent,
} from '@/utils/request/decorators';
import { ClientResponse, ResponseTimeout } from '@/utils/response/decorators';

import { AclGuard } from '@/auth/guards';

import { IReqLogData } from '@/log/types';

import { EnumLogAction } from '@/log/constants';

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
  ) {}
  @ClientResponse('test.ping')
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

  @ClientResponse('test.auth')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/auth')
  async helloAuth(
    @RequestUserAgent() userAgent: IResult,
    @RequestTimezone() timezone: string,
    @ReqUser() reqUser,
  ): Promise<IResponseData> {
    const newDate = this.helperDateService.create({
      timezone,
    });
    return {
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
  @ErrorMeta(TestingCommonController.name, 'helloTimeoutCustom')
  @Get('/timeout')
  async timeout(): Promise<IResponseData> {
    await this.helperService.delay(5000);
    return;
  }

  @ClientResponse('response.default')
  @ResponseTimeout('2s')
  @ErrorMeta(TestingCommonController.name, 'errorTest')
  @Get('/error')
  async errorTest(): Promise<void> {
    throw new UnprocessableEntityException({
      statusCode: EnumRequestStatusCodeError.RequestValidationError,
      message: 'http.clientError.unprocessableEntity',
      error: 'Test error message',
    });
  }

  @ClientResponse('response.default')
  @Get('/log')
  async logTest(
    @ReqLogData()
    logData: IReqLogData,
  ): Promise<void> {
    this.logService.error({
      ...logData,
      action: EnumLogAction.Test,
      description: 'Test error log',
      tags: ['test'],
      data: { error: 'some error' },
    });
  }
}

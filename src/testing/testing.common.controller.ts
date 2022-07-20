import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
// Services
import { CloudinaryService } from '@/cloudinary/service';
import { HelperDateService, HelperService } from '@/utils/helper/service';
//
import { RequestTimezone, RequestUserAgent } from '@/utils/request';
import { Response, IResponse, ResponseTimeout } from '@/utils/response';
import { IResult } from 'ua-parser-js';
import { AclGuard } from '@/auth';
import { ErrorMeta } from '@/utils/error';

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
  @AclGuard()
  @Get('/auth')
  async helloAuth(
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

import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { UserAgent } from '@/utils/request/request.decorator';
import { Response } from '@/utils/response/response.decorator';
import { IResponse } from '@/utils/response/response.interface';
import { GetVersion } from '@/utils/version/version.decorator';
import { IResult } from 'ua-parser-js';

@Controller({
  version: VERSION_NEUTRAL,
})
export class TestingCommonController {
  @Response('test.hello')
  @Get('/hello')
  async hello(
    @UserAgent() userAgent: IResult,
    @GetVersion() version: number,
  ): Promise<IResponse> {
    return { userAgent, version };
  }
}

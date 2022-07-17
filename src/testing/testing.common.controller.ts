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
//
import { UserAgent } from '@/utils/request';
import { Response, IResponse } from '@/utils/response';
import { IResult } from 'ua-parser-js';
import { AclGuard } from '@/auth';

@Throttle(1, 5)
@Controller({
  version: VERSION_NEUTRAL,
})
export class TestingCommonController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Response('test.ping')
  @HttpCode(HttpStatus.OK)
  @Get()
  async hello(@UserAgent() userAgent: IResult): Promise<IResponse> {
    return { userAgent };
  }

  @Response('test.auth')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/auth')
  async helloAuth(@UserAgent() userAgent: IResult): Promise<IResponse> {
    return { userAgent };
  }
  @Response('test.auth')
  @HttpCode(HttpStatus.OK)
  @Get('/cld')
  async list(@UserAgent() userAgent: IResult): Promise<IResponse> {
    // const xxx = await this.cloudinaryService.list();
    return;
  }
}

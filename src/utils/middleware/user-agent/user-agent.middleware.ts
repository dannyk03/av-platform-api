import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NextFunction, Response } from 'express';
import userAgentParser from 'ua-parser-js';

import { EnumRequestStatusCodeError } from '@/utils/request/request.constant';
import { IRequestApp } from '@/utils/request/request.interface';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IRequestApp, res: Response, next: NextFunction): void {
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');

    if (isSecureMode) {
      // Put your specific user agent
      const userAgent: string = req.headers['user-agent'] as string;
      if (!userAgent) {
        throw new ForbiddenException({
          statusCode: EnumRequestStatusCodeError.RequestUserAgentInvalidError,
          message: 'middleware.error.userAgentInvalid',
        });
      }
    }
    req.userAgent = userAgentParser(req.headers['user-agent']);
    next();
  }
}

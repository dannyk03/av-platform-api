import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NextFunction, Response } from 'express';

import { HelperDateService } from '@/utils/helper/service';

import { IRequestApp } from '@/utils/request';

@Injectable()
export class TimestampMiddleware implements NestMiddleware {
  constructor(
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
  ) {}

  async use(
    req: IRequestApp,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');
    let reqTs: string = req.headers['x-timestamp'] as string;

    if (!(isSecureMode || reqTs)) {
      const currentTimestamp: number = this.helperDateService.timestamp();
      reqTs = `${currentTimestamp}`;
    }

    req.headers['x-timestamp'] = reqTs;
    req.timestamp = reqTs;

    next();
  }
}

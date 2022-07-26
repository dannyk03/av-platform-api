import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NextFunction, Response } from 'express';

import { HelperDateService } from '@/utils/helper/service';
import { IRequestApp } from '@/utils/request/request.interface';

@Injectable()
export class TimestampMiddleware implements NestMiddleware {
  constructor(
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
  ) {}

  async use(
    req: IRequestApp,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const mode: string = this.configService.get<string>('app.mode');
    let reqTs: string = req.headers['x-timestamp'] as string;

    const currentTimestamp: number = this.helperDateService.timestamp();

    if (mode !== 'secure' && !reqTs) {
      reqTs = `${currentTimestamp}`;
    }

    req.headers['x-timestamp'] = reqTs;
    req.timestamp = reqTs;

    next();
  }
}

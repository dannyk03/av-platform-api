import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NextFunction, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';

import { IRequestApp } from '@/utils/request/request.interface';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IRequestApp, res: Response, next: NextFunction): void {
    const correlationId = req.header('x-correlation-id') || uuidV4();
    req.headers['x-correlation-id'] = correlationId;
    req.correlationId = correlationId;
    res.set('X-Correlation-Id', correlationId);
    next();
  }
}

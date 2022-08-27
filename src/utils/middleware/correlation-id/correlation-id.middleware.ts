import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import cuid from 'cuid';
import { NextFunction, Response } from 'express';

import { IRequestApp } from '@/utils/request/types';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IRequestApp, res: Response, next: NextFunction): void {
    const correlationId = req.header('x-correlation-id') || cuid();
    req.headers['x-correlation-id'] = correlationId;
    req.correlationId = correlationId;
    res.set('X-Correlation-Id', correlationId);
    next();
  }
}

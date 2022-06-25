import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import { IRequestApp } from '@/utils/request/request.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IRequestApp, res: Response, next: NextFunction): void {
    const correlationHeader = req.header('x-correlation-id') || uuidV4();
    req.headers['x-correlation-id'] = correlationHeader;
    res.set('X-Correlation-Id', correlationHeader);
    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    helmet({ xssFilter: false })(req, res, next);
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
}

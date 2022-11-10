import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import cors, { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const isSecureMode: boolean =
      this.configService.get<boolean>('app.isSecureMode');
    const isProduction = this.configService.get<boolean>('app.isProduction');

    const allowOrigin = this.configService.get<string | boolean | string[]>(
      'middleware.cors.allowOrigin',
    );
    const allowMethod = this.configService.get<string[]>(
      'middleware.cors.allowMethod',
    );
    const allowHeader = this.configService.get<string[]>(
      'middleware.cors.allowHeader',
    );

    const whitelist = ['http://localhost:3000', 'https://localhost:3000']; // whitelist local dev origin
    const corsOptions: CorsOptions = {
      origin: (origin, callback) => {
        if ((!isProduction || !isSecureMode) && whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, allowOrigin);
        }
      },
      methods: allowMethod,
      allowedHeaders: allowHeader,
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: HttpStatus.NO_CONTENT,
    };

    cors(corsOptions)(req, res, next);
  }
}

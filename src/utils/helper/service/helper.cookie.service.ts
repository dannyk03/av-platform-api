import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { HelperDateService } from './helper.date.service';
import { HelperJwtService } from './helper.jwt.service';

@Injectable()
export class HelperCookieService {
  private readonly accessTokenCookieName = 'accessToken';
  private readonly isSecureMode: boolean;
  private readonly isProduction: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly helperJwtService: HelperJwtService,
    private readonly helperDateService: HelperDateService,
  ) {
    this.isSecureMode = this.configService.get<boolean>('app.isSecureMode');
    this.isProduction = this.configService.get<boolean>('app.isProduction');
  }

  async attachAccessToken(response: Response, accessToken: string) {
    return response.cookie(this.accessTokenCookieName, accessToken, {
      secure: this.isProduction,
      expires: this.helperJwtService.getJwtExpiresDate(accessToken),
      sameSite: 'none',
      httpOnly: true,
    });
  }

  async detachAccessToken(response: Response) {
    return response.cookie(this.accessTokenCookieName, undefined, {
      secure: this.isProduction,
      expires: this.helperDateService.create(),
      sameSite: 'none',
      httpOnly: true,
    });
  }
}

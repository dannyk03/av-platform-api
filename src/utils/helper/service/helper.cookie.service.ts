import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Response as ExpressResponse } from 'express';

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

  async attachAccessToken(response: ExpressResponse, accessToken: string) {
    return response.cookie(this.accessTokenCookieName, accessToken, {
      secure: this.isSecureMode && this.isProduction,
      expires: this.helperJwtService.getJwtExpiresDate(accessToken),
      sameSite: 'strict',
      httpOnly: true,
    });
  }
  async detachAccessToken(response: ExpressResponse) {
    return response.cookie(this.accessTokenCookieName, undefined, {
      secure: this.isSecureMode && this.isProduction,
      expires: this.helperDateService.create(),
      sameSite: 'strict',
      httpOnly: true,
    });
  }
}

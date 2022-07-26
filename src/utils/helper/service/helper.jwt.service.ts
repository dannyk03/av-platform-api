import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HelperEncryptionService } from './helper.encryption.service';

@Injectable()
export class HelperJwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly helperEncryptionService: HelperEncryptionService,
  ) {}

  getJwtExpiresDate(token: string): Date {
    const jwt = this.helperEncryptionService.jwtDecrypt(token);
    const date = new Date(0);
    date.setUTCSeconds(jwt.exp);
    return date;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EnumAuthStatusCodeError } from '@avo/type';

@Injectable()
export class JwtOptionalGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: Record<string, any>, user: TUser): TUser {
    if (err) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtAccessTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    return user || null;
  }
}

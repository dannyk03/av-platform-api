import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EnumAuthStatusCodeError } from '@avo/type';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwtRefresh') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: Record<string, any>, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtRefreshTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    return user;
  }
}

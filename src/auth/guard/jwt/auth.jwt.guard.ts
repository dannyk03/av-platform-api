import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EnumAuthStatusCodeError } from '@avo/type';

import { AuthUserLoginSerialization } from '@/auth';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = AuthUserLoginSerialization>(
    err: Record<string, any>,
    user: TUser,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtAccessTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    return user;
  }
}

import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnumAuthStatusCodeError } from '@/auth';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: Record<string, any>, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtAccessTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    return user;
  }
}

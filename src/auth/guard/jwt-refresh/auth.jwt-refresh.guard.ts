import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EnumAuthStatusCodeError } from '@/auth';
import { DebuggerService } from '@/debugger/service';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwtRefresh') {
  constructor(private readonly debuggerService: DebuggerService) {
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

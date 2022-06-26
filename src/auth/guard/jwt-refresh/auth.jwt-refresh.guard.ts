import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { EnumAuthStatusCodeError } from '@/auth';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwtRefresh') {
  constructor(private readonly debuggerService: DebuggerService) {
    super();
  }

  handleRequest<TUser = any>(
    err: Record<string, any>,
    user: TUser,
    info: string,
  ): TUser {
    if (err || !user) {
      this.debuggerService.error(info, 'JwtRefreshGuard', 'handleRequest', err);

      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtRefreshTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    return user;
  }
}

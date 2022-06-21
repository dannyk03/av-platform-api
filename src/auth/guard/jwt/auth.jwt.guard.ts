import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnumAuthStatusCodeError } from '@/auth';
import { DebuggerService } from '@/debugger';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly debuggerService: DebuggerService) {
    super();
  }

  handleRequest<TUser = any>(
    err: Record<string, any>,
    user: TUser,
    info: string,
  ): TUser {
    if (err || !user) {
      this.debuggerService.error(info, 'JwtGuard', 'handleRequest', err);

      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtAccessTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    return user;
  }
}

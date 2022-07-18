import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { EnumAuthStatusCodeError } from '@/auth';

@Injectable()
export class JwtGiftSendGuard extends AuthGuard('jwt') {
  constructor(private readonly debuggerService: DebuggerService) {
    super();
  }

  handleRequest<TUser = any>(
    err: Record<string, any>,
    user: TUser,
    info: string,
  ): TUser {
    if (err) {
      this.debuggerService.info(info, 'JwtGiftSendGuard', 'handleRequest', err);
      debugger;
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtAccessTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    return user || null;
  }
}

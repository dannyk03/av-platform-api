import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EnumAuthStatusCodeError } from '@/auth';
import { DebuggerService } from '@/debugger/service';

@Injectable()
export class JwtGiftSendGuard extends AuthGuard('jwt') {
  constructor(private readonly debuggerService: DebuggerService) {
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

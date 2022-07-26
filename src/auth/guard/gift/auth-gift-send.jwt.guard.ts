import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// Services
import { DebuggerService } from '$/debugger/service';
//
import { EnumAuthStatusCodeError } from '$/auth';

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

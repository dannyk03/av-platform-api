import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthStatusCodeError } from '@/auth/auth.constant';
import { DebuggerService } from '@/debugger/service/debugger.service';

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
            this.debuggerService.error(
                info,
                'JwtRefreshGuard',
                'handleRequest',
                err,
            );

            throw new UnauthorizedException({
                statusCode: AuthStatusCodeError.AuthGuardJwtRefreshTokenError,
                message: 'http.clientError.unauthorized',
            });
        }

        return user;
    }
}

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { AuthStatusCodeError } from '@/auth/auth.constant';
import { DebuggerService } from '@/debugger/service/debugger.service';

@Injectable()
export class AuthPayloadDefaultGuard implements CanActivate {
    constructor(private readonly debuggerService: DebuggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();

        if (!user.isActive) {
            this.debuggerService.error(
                'UserGuard Inactive',
                'AuthDefaultGuard',
                'canActivate',
            );

            throw new ForbiddenException({
                statusCode: AuthStatusCodeError.AuthGuardInactiveError,
                message: 'auth.error.blocked',
            });
        } else if (!user.role.isActive) {
            this.debuggerService.error(
                'UserGuard Role Inactive',
                'AuthDefaultGuard',
                'canActivate',
            );

            throw new ForbiddenException({
                statusCode: AuthStatusCodeError.AuthGuardRoleInactiveError,
                message: 'auth.error.roleBlocked',
            });
        }

        return true;
    }
}

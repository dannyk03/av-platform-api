import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { EnumAuthStatusCodeError } from '@/auth';
import { DebuggerService } from '@/debugger';

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
        statusCode: EnumAuthStatusCodeError.AuthGuardInactiveError,
        message: 'auth.error.blocked',
      });
    } else if (!user.role.isActive) {
      this.debuggerService.error(
        'UserGuard Role Inactive',
        'AuthDefaultGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardRoleInactiveError,
        message: 'auth.error.roleBlocked',
      });
    }

    return true;
  }
}

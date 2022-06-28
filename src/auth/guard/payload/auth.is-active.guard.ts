import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { EnumAuthStatusCodeError } from '@/auth';

@Injectable()
export class JwtUserActiveGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { user } = ctx.switchToHttp().getRequest();

    if (!user.isActive) {
      this.debuggerService.error(
        'User Inactive',
        'AuthIsActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardInactiveError,
        message: 'auth.error.blocked',
      });
    }

    if (!user.role.isActive) {
      this.debuggerService.error(
        'User Role Inactive',
        'AuthIsActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardRoleInactiveError,
        message: 'auth.error.roleBlocked',
      });
    }

    if (!user.organization.isActive) {
      this.debuggerService.error(
        'User Organization Inactive',
        'AuthIsActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardOrganizationInactiveError,
        message: 'auth.error.organizationBlocked',
      });
    }

    return true;
  }
}

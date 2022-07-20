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
      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardInactiveError,
        message: 'auth.error.blocked',
      });
    }

    if (!user.role.isActive) {
      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardRoleInactiveError,
        message: 'auth.error.roleBlocked',
      });
    }

    if (!user.organization.isActive) {
      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardOrganizationInactiveError,
        message: 'auth.error.organizationBlocked',
      });
    }

    return true;
  }
}

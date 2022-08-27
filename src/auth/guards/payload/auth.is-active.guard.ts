import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { EnumAuthStatusCodeError } from '@avo/type';

import { DebuggerService } from '@/debugger/service';

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

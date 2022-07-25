import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { EnumRoleStatusCodeError } from '../acl-role.constant';

@Injectable()
export class ReqUserAclRoleActiveGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { __user } = ctx.switchToHttp().getRequest();

    if (__user.role && !__user.role.isActive) {
      throw new ForbiddenException({
        statusCode: __user.role
          ? EnumRoleStatusCodeError.RoleInactiveError
          : EnumRoleStatusCodeError.RoleNotFoundError,
        message: __user.role ? 'role.error.inactive' : 'role.error.notFound',
      });
    }

    return true;
  }
}

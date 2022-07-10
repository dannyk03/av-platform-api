import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
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
      this.debuggerService.error(
        __user.role ? 'Role inactive error' : 'Role not found error',
        'ReqUserAclRoleActiveGuard',
        'canActivate',
      );

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

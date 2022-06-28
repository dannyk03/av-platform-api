import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
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

    if (!__user.role) {
      this.debuggerService.error(
        'Role not found error',
        'ReqUserAclRoleActiveGuard',
        'canActivate',
      );

      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.RoleNotFoundError,
        message: 'role.error.notFound',
      });
    } else if (!__user.role.isActive) {
      this.debuggerService.error(
        'Role inactive error',
        'ReqUserAclRoleActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleInactiveError,
        message: 'role.error.inactive',
      });
    }

    return true;
  }
}

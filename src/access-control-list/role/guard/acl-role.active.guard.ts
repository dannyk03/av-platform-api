import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { EnumRoleStatusCodeError } from '@avo/type';

@Injectable()
export class ReqUserAclRoleActiveGuard implements CanActivate {
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

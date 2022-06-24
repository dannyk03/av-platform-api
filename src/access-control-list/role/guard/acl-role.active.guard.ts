import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { EnumRoleStatusCodeError } from '../acl-role.constant';
//

@Injectable()
export class ReqUserAclRoleActiveGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __user } = context.switchToHttp().getRequest();

    if (!__user.role?.isActive) {
      this.debuggerService.error(
        'User Role active error',
        'AclRoleActiveGuard',
        'canActivate',
      );

      throw new BadRequestException({
        statusCode: EnumRoleStatusCodeError.RoleActiveError,
        message: 'user.error.active',
      });
    }
    return true;
  }
}
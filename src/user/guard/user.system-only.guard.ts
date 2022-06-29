import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import { EnumUserStatusCodeError } from '../user.constant';
import { Reflector } from '@nestjs/core';
import { SYSTEM_ONLY_META_KEY, SYSTEM_ORGANIZATION_NAME } from '@/system';
import { EnumOrganizationStatusCodeError } from '@/organization';

@Injectable()
export class ReqUserSystemOnlyGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredSystemOnly = this.reflector.getAllAndOverride<boolean>(
      SYSTEM_ONLY_META_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredSystemOnly) {
      return true;
    }

    const { __user } = ctx.switchToHttp().getRequest();

    if (!__user) {
      this.debuggerService.error(
        'User not found error',
        'ReqUserSystemOnlyGuard',
        'canActivate',
      );

      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    } else if (__user.organization?.name !== SYSTEM_ORGANIZATION_NAME) {
      this.debuggerService.error(
        'System only error',
        'ReqUserOrganizationActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationNotSystemError,
        message: 'organization.error.systemOnly',
      });
    }
    return true;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { EnumOrganizationStatusCodeError } from '../organization.constant';

@Injectable()
export class ReqUserOrganizationActiveGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { __user } = request;

    if (__user.organization && !__user.organization?.isActive) {
      this.debuggerService.error(
        __user.organization
          ? 'Organization inactive error'
          : 'Organization not found error',
        'ReqUserOrganizationActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: __user.organization
          ? EnumOrganizationStatusCodeError.OrganizationInactiveError
          : EnumOrganizationStatusCodeError.OrganizationNotFoundError,
        message: __user.organization
          ? 'organization.error.inactive'
          : 'organization.error.notFound',
      });
    }

    return true;
  }
}

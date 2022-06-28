import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import { EnumOrganizationStatusCodeError } from '../organization.constant';

@Injectable()
export class ReqUserOrganizationActiveGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { __user } = request;

    if (!__user.organization) {
      this.debuggerService.error(
        'Organization not found error',
        'ReqUserOrganizationActiveGuard',
        'canActivate',
      );

      throw new NotFoundException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationNotFoundError,
        message: 'organization.error.notFound',
      });
    } else if (!__user.organization?.isActive) {
      this.debuggerService.error(
        'Organization inactive error',
        'ReqUserOrganizationActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationInactiveError,
        message: 'organization.error.inactive',
      });
    }

    return true;
  }
}

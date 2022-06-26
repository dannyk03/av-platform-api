import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import { EnumOrganizationStatusCodeError } from '../organization.constant';

@Injectable()
export class ReqUserOrganizationActiveGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { __user } = ctx.switchToHttp().getRequest();

    if (!__user.organization?.isActive) {
      this.debuggerService.error(
        'Organization active error',
        'ReqUserOrganizationActiveGuard',
        'canActivate',
      );

      throw new BadRequestException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationActiveError,
        message: 'organization.error.active',
      });
    }
    return true;
  }
}

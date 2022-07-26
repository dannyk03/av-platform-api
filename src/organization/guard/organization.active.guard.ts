import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EnumOrganizationStatusCodeError } from '../organization.constant';

@Injectable()
export class ReqUserOrganizationActiveGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { __user } = request;

    if (__user.organization && !__user.organization?.isActive) {
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

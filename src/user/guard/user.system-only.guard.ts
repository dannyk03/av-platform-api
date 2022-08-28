import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  EnumOrganizationStatusCodeError,
  EnumUserStatusCodeError,
} from '@avo/type';

import { SYSTEM_ONLY_META_KEY, SYSTEM_ORGANIZATION_NAME } from '@/system';

@Injectable()
export class ReqUserSystemOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

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
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    }

    if (__user.organization?.name !== SYSTEM_ORGANIZATION_NAME) {
      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationSystemOnlyError,
        message: 'organization.error.systemOnly',
      });
    }
    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EnumUserStatusCodeError } from '../user.constant';

@Injectable()
export class ReqUserActiveGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { __user } = ctx.switchToHttp().getRequest();

    if (!__user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    } else if (!__user.isActive) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserInactiveError,
        message: 'user.error.inactive',
      });
    }
    return true;
  }
}

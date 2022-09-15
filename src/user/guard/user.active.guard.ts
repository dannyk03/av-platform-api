import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { EnumAuthStatusCodeError, EnumUserStatusCodeError } from '@avo/type';

@Injectable()
export class ReqUserActiveGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { __user } = ctx.switchToHttp().getRequest();

    if (!__user) {
      throw new BadRequestException({
        statusCode: EnumAuthStatusCodeError.AuthPasswordNotMatchError,
        message: 'auth.error.badRequest',
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

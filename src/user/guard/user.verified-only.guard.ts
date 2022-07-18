import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// Services
import { DebuggerService } from '@/debugger/service';
//
import {
  EnumUserStatusCodeError,
  USER_VERIFIED_ONLY_META_KEY,
} from '../user.constant';
import { EnumOrganizationStatusCodeError } from '@/organization';

@Injectable()
export class ReqUserVerifiedOnlyGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredVerifiedOnly = this.reflector.getAllAndOverride<boolean>(
      USER_VERIFIED_ONLY_META_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredVerifiedOnly) {
      return true;
    }

    const { __user } = ctx.switchToHttp().getRequest();

    if (!__user) {
      this.debuggerService.error(
        'User not found error',
        'ReqUserVerifiedOnlyGuard',
        'canActivate',
      );

      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    } else if (__user.authConfig?.emailVerifiedAt) {
      this.debuggerService.error(
        'Verified users only error',
        'ReqUserVerifiedOnlyGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationSystemOnlyError,
        message: 'user.error.verified',
      });
    }
    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { EnumUserStatusCodeError } from '@avo/type';

import { IRequestApp } from '@/utils/request/type';

import { USER_VERIFIED_ONLY_META_KEY } from '../constant';

@Injectable()
export class ReqUserVerifiedOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredVerifiedOnly = this.reflector.getAllAndOverride<boolean>(
      USER_VERIFIED_ONLY_META_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredVerifiedOnly) {
      return true;
    }

    const { __user } = ctx.switchToHttp().getRequest() as IRequestApp;

    if (!__user) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    }

    if (
      !(
        __user.authConfig?.phoneVerifiedAt || __user.authConfig?.emailVerifiedAt
      )
    ) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserVerifiedOnlyError,
        message: 'user.error.verified',
      });
    }
    return true;
  }
}

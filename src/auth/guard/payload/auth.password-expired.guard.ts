import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
// Services

import { HelperDateService } from '@/utils/helper/service';
//
import { EnumAuthStatusCodeError } from '@/auth';

@Injectable()
export class AuthPayloadPasswordExpiredGuard implements CanActivate {
  constructor(private readonly helperDateService: HelperDateService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { user } = ctx.switchToHttp().getRequest();
    const { authConfig } = user;

    if (authConfig) {
      const now = this.helperDateService.create();
      const passwordExpiredDate = this.helperDateService.create(
        authConfig.passwordExpiredAt,
      );

      if (now > passwordExpiredDate) {
        throw new ForbiddenException({
          statusCode: EnumAuthStatusCodeError.AuthGuardPasswordExpiredError,
          message: 'auth.error.passwordExpired',
        });
      }
    }
    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { EnumAuthStatusCodeError } from '@/auth';
import { HelperDateService } from '@/utils/helper/service';

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

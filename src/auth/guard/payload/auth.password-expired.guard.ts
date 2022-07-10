import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { HelperDateService } from '@/utils/helper/service';
//
import { EnumAuthStatusCodeError } from '@/auth';

@Injectable()
export class AuthPayloadPasswordExpiredGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { user } = ctx.switchToHttp().getRequest();
    const { authConfig } = user;
    const now = this.helperDateService.create();
    const passwordExpiredDate = this.helperDateService.create(
      authConfig.passwordExpiredAt,
    );

    if (now > passwordExpiredDate) {
      this.debuggerService.error(
        'Auth password expired',
        'AuthPasswordExpiredGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardPasswordExpiredError,
        message: 'auth.error.passwordExpired',
      });
    }

    return true;
  }
}

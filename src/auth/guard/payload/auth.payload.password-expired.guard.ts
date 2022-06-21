import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { EnumAuthStatusCodeError } from '@/auth/auth.constant';
import { DebuggerService } from '@/debugger';
import { HelperDateService } from '@/utils/helper';

@Injectable()
export class AuthPayloadPasswordExpiredGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const { passwordExpired } = user;
    const today: Date = this.helperDateService.create();
    const passwordExpiredDate = this.helperDateService.create(passwordExpired);

    if (today > passwordExpiredDate) {
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

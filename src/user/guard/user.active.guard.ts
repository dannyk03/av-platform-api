import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { EnumUserStatusCodeError } from '../user.constant';

@Injectable()
export class ReqUserActiveGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { __user } = ctx.switchToHttp().getRequest();

    if (!__user) {
      this.debuggerService.error(
        'User not found error',
        'ReqUserActiveGuard',
        'canActivate',
      );

      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    } else if (!__user.isActive) {
      this.debuggerService.error(
        'User inactive error',
        'ReqUserActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserInactiveError,
        message: 'user.error.inactive',
      });
    }
    return true;
  }
}

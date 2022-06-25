import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import { EnumUserStatusCodeError } from '../user.constant';

@Injectable()
export class ReqUserActiveGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __user } = context.switchToHttp().getRequest();

    if (!__user.isActive) {
      this.debuggerService.error(
        'User active error',
        'UserActiveGuard',
        'canActivate',
      );

      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.UserActiveError,
        message: 'user.error.active',
      });
    }
    return true;
  }
}

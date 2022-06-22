import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AUTH_ADMIN_META_KEY, EnumAuthStatusCodeError } from '@/auth';
import { Reflector } from '@nestjs/core';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
//

@Injectable()
export class AuthPayloadAdminGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
      AUTH_ADMIN_META_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!required.includes(user.role.isAdmin)) {
      this.debuggerService.error(
        'Auth active error',
        'AuthActiveGuard',
        'canActivate',
      );

      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.AuthGuardAdminError,
        message: 'auth.error.admin',
      });
    }
    return true;
  }
}

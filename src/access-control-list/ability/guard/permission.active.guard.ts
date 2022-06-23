import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import {
  PermissionsStatusCodeError,
  PERMISSION_ACTIVE_META_KEY,
} from '../acl-ability.constant';

@Injectable()
export class PermissionActiveGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
      PERMISSION_ACTIVE_META_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }

    const { __permission } = context.switchToHttp().getRequest();

    if (!required.includes(__permission.isActive)) {
      this.debuggerService.error(
        'Permission active error',
        'PermissionActiveGuard',
        'canActivate',
      );

      throw new BadRequestException({
        statusCode: PermissionsStatusCodeError.ActiveError,
        message: 'permission.error.active',
      });
    }
    return true;
  }
}

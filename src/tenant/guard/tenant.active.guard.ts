import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DebuggerService } from '@/debugger/service/debugger.service';
import {
  ENUM_TENANT_STATUS_CODE_ERROR,
  TENANT_ACTIVE_META_KEY,
} from '../tenant.constant';

@Injectable()
export class TenantActiveGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
      TENANT_ACTIVE_META_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }

    const { __tenant } = context.switchToHttp().getRequest();

    if (!required.includes(__tenant.isActive)) {
      this.debuggerService.error(
        'Tenant active error',
        'TenantActiveGuard',
        'canActivate',
      );

      throw new BadRequestException({
        statusCode: ENUM_TENANT_STATUS_CODE_ERROR.TENANT_ACTIVE_ERROR,
        message: 'tenant.error.active',
      });
    }
    return true;
  }
}

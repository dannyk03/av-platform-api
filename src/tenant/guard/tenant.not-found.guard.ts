import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { ENUM_TENANT_STATUS_CODE_ERROR } from '../tenant.constant';

@Injectable()
export class TenantNotFoundGuard implements CanActivate {
  constructor(private readonly debuggerService: DebuggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __tenant } = context.switchToHttp().getRequest();

    if (!__tenant) {
      this.debuggerService.error(
        'Tenant not found',
        'TenantNotFoundGuard',
        'canActivate',
      );

      throw new NotFoundException({
        statusCode: ENUM_TENANT_STATUS_CODE_ERROR.TENANT_NOT_FOUND_ERROR,
        message: 'tenant.error.notFound',
      });
    }

    return true;
  }
}

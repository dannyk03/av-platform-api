import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { PermissionsStatusCodeError } from '../permission.constant';

@Injectable()
export class PermissionNotFoundGuard implements CanActivate {
    constructor(private readonly debuggerService: DebuggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __permission } = context.switchToHttp().getRequest();

        if (!__permission) {
            this.debuggerService.error(
                'Permission not found',
                'PermissionNotFoundGuard',
                'canActivate',
            );

            throw new NotFoundException({
                statusCode: PermissionsStatusCodeError.NotFoundError,
                message: 'permission.error.notFound',
            });
        }
        return true;
    }
}

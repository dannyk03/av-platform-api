import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { RoleStatusCodeError } from '../role.constant';

@Injectable()
export class RoleNotFoundGuard implements CanActivate {
    constructor(private readonly debuggerService: DebuggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __role } = context.switchToHttp().getRequest();

        if (!__role) {
            this.debuggerService.error(
                'Role not found',
                'RoleNotFoundGuard',
                'canActivate',
            );

            throw new NotFoundException({
                statusCode: RoleStatusCodeError.RoleNotFoundError,
                message: 'role.error.notFound',
            });
        }

        return true;
    }
}

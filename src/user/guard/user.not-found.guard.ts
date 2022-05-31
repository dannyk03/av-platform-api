import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { UserStatusCodeError } from '../user.constant';

@Injectable()
export class UserNotFoundGuard implements CanActivate {
    constructor(private readonly debuggerService: DebuggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __user } = context.switchToHttp().getRequest();

        if (!__user) {
            this.debuggerService.error(
                'User not found',
                'UserNotFoundGuard',
                'canActivate',
            );

            throw new NotFoundException({
                statusCode: UserStatusCodeError.UserNotFoundError,
                message: 'user.error.notFound',
            });
        }

        return true;
    }
}

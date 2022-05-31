import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { SettingStatusCodeError } from '../setting.constant';

@Injectable()
export class SettingNotFoundGuard implements CanActivate {
    constructor(private readonly debuggerService: DebuggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __setting } = context.switchToHttp().getRequest();

        if (!__setting) {
            this.debuggerService.error(
                'Setting not found',
                'SettingNotFoundGuard',
                'canActivate',
            );

            throw new NotFoundException({
                statusCode: SettingStatusCodeError.SettingNotFoundError,
                message: 'setting.error.notFound',
            });
        }

        return true;
    }
}

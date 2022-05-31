import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DebuggerService } from '@/debugger/service/debugger.service';
import {
    OrganizationStatusCodeError,
    ORGANIZATION_ACTIVE_META_KEY,
} from '../organization.constant';

@Injectable()
export class OrganizationActiveGuard implements CanActivate {
    constructor(
        private readonly debuggerService: DebuggerService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            ORGANIZATION_ACTIVE_META_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!required) {
            return true;
        }

        const { __organization } = context.switchToHttp().getRequest();

        if (!required.includes(__organization.isActive)) {
            this.debuggerService.error(
                'Organization active error',
                'OrganizationActiveGuard',
                'canActivate',
            );

            throw new BadRequestException({
                statusCode: OrganizationStatusCodeError.OrganizationActiveError,
                message: 'organization.error.active',
            });
        }
        return true;
    }
}

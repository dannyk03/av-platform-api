import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { OrganizationStatusCodeError } from '../organization.constant';

@Injectable()
export class OrganizationNotFoundGuard implements CanActivate {
    constructor(private readonly debuggerService: DebuggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __organization } = context.switchToHttp().getRequest();

        if (!__organization) {
            this.debuggerService.error(
                'Organization not found',
                'OrganizationNotFoundGuard',
                'canActivate',
            );

            throw new NotFoundException({
                statusCode:
                    OrganizationStatusCodeError.OrganizationNotFoundError,
                message: 'organization.error.notFound',
            });
        }

        return true;
    }
}

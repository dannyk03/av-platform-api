import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { ENUM_ORGANIZATION_STATUS_CODE_ERROR } from '../organization.constant';

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
                    ENUM_ORGANIZATION_STATUS_CODE_ERROR.ORGANIZATION_NOT_FOUND_ERROR,
                message: 'organization.error.notFound',
            });
        }

        return true;
    }
}

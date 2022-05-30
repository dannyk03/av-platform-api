import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { TenantActiveGuard } from './guard/tenant.active.guard';
import { TenantNotFoundGuard } from './guard/tenant.not-found.guard';
import { TenantPutToRequestGuard } from './guard/tenant.put-to-request.guard';
import { TENANT_ACTIVE_META_KEY } from './tenant.constant';

export const GetTenant = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const { __tenant } = ctx.switchToHttp().getRequest();
        return __tenant;
    },
);

export function TenantGetGuard(): any {
    return applyDecorators(
        UseGuards(TenantPutToRequestGuard, TenantNotFoundGuard),
    );
}

export function TenantUpdateGuard(): any {
    return applyDecorators(
        UseGuards(
            TenantPutToRequestGuard,
            TenantNotFoundGuard,
            TenantActiveGuard,
        ),
        SetMetadata(TENANT_ACTIVE_META_KEY, [true]),
    );
}

export function TenantDeleteGuard(): any {
    return applyDecorators(
        UseGuards(
            TenantPutToRequestGuard,
            TenantNotFoundGuard,
            TenantActiveGuard,
        ),
        SetMetadata(TENANT_ACTIVE_META_KEY, [true]),
    );
}

export function TenantUpdateActiveGuard(): any {
    return applyDecorators(
        UseGuards(
            TenantPutToRequestGuard,
            TenantNotFoundGuard,
            TenantActiveGuard,
        ),
        SetMetadata(TENANT_ACTIVE_META_KEY, [false]),
    );
}

export function TenantUpdateInactiveGuard(): any {
    return applyDecorators(
        UseGuards(
            TenantPutToRequestGuard,
            TenantNotFoundGuard,
            TenantActiveGuard,
        ),
        SetMetadata(TENANT_ACTIVE_META_KEY, [true]),
    );
}

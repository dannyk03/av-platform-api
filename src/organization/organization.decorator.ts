import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { OrganizationActiveGuard } from './guard/organization.active.guard';
import { OrganizationNotFoundGuard } from './guard/organization.not-found.guard';
import { OrganizationPutToRequestGuard } from './guard/organization.put-to-request.guard';
import { ORGANIZATION_ACTIVE_META_KEY } from './organization.constant';

export const GetOrganization = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const { __organization } = ctx.switchToHttp().getRequest();
        return __organization;
    },
);

export function OrganizationGetGuard(): any {
    return applyDecorators(
        UseGuards(OrganizationPutToRequestGuard, OrganizationNotFoundGuard),
    );
}

export function OrganizationUpdateGuard(): any {
    return applyDecorators(
        UseGuards(
            OrganizationPutToRequestGuard,
            OrganizationNotFoundGuard,
            OrganizationActiveGuard,
        ),
        SetMetadata(ORGANIZATION_ACTIVE_META_KEY, [true]),
    );
}

export function OrganizationDeleteGuard(): any {
    return applyDecorators(
        UseGuards(
            OrganizationPutToRequestGuard,
            OrganizationNotFoundGuard,
            OrganizationActiveGuard,
        ),
        SetMetadata(ORGANIZATION_ACTIVE_META_KEY, [true]),
    );
}

export function OrganizationUpdateActiveGuard(): any {
    return applyDecorators(
        UseGuards(
            OrganizationPutToRequestGuard,
            OrganizationNotFoundGuard,
            OrganizationActiveGuard,
        ),
        SetMetadata(ORGANIZATION_ACTIVE_META_KEY, [false]),
    );
}

export function OrganizationUpdateInactiveGuard(): any {
    return applyDecorators(
        UseGuards(
            OrganizationPutToRequestGuard,
            OrganizationNotFoundGuard,
            OrganizationActiveGuard,
        ),
        SetMetadata(ORGANIZATION_ACTIVE_META_KEY, [true]),
    );
}

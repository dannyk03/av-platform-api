import {
  ExecutionContext,
  ForbiddenException,
  UnprocessableEntityException,
  createParamDecorator,
} from '@nestjs/common';

import { isUUID } from 'class-validator';

import { PermissionsStatusCodeError } from '@/access-control-list/ability';
import { SYSTEM_ORGANIZATION_NAME } from '@/system';
import { slugify } from '@/utils/helper';
import { EnumRequestStatusCodeError } from '@/utils/request';

import { IReqOrganizationIdentifierCtx } from './organization.interface';

function throwForbiddenExceptionForCorruptedOrganizationCtx() {
  throw new ForbiddenException({
    statusCode: PermissionsStatusCodeError.Forbidden,
    message: 'permission.error.forbidden',
  });
}

export const ReqOrganizationIdentifierCtx = createParamDecorator(
  (_data: string, ctx: ExecutionContext): IReqOrganizationIdentifierCtx => {
    const request = ctx.switchToHttp().getRequest();
    const { query, body, __user } = request;
    const {
      id: reqUserOrganizationId,
      name: reqUserOrganizationName,
      slug: reqUserOrganizationSlug,
    } = __user.organization;
    const {
      organizationId: bodyOrganizationId,
      organizationSlug: bodyOrganizationSlug,
    } = body;
    const {
      organizationId: queryOrganizationId,
      organizationSlug: queryOrganizationSlug,
    } = query;

    const reqOrganizationIdCtx: string | undefined =
      reqUserOrganizationName === SYSTEM_ORGANIZATION_NAME
        ? bodyOrganizationId || queryOrganizationId
          ? bodyOrganizationId || queryOrganizationId
          : !(bodyOrganizationSlug || queryOrganizationSlug)
          ? reqUserOrganizationId
          : undefined
        : (bodyOrganizationId &&
            bodyOrganizationId !== __user.organization.id) ||
          (queryOrganizationId &&
            queryOrganizationId !== __user.organization.id)
        ? throwForbiddenExceptionForCorruptedOrganizationCtx()
        : reqUserOrganizationId;

    const reqOrganizationSlugCtx: string | undefined =
      reqUserOrganizationName === SYSTEM_ORGANIZATION_NAME
        ? bodyOrganizationSlug || queryOrganizationSlug
          ? slugify(bodyOrganizationSlug) || slugify(queryOrganizationSlug)
          : !(bodyOrganizationId || queryOrganizationId)
          ? reqUserOrganizationSlug
          : undefined
        : (bodyOrganizationSlug &&
            bodyOrganizationSlug !== __user.organization.slug) ||
          (queryOrganizationSlug &&
            queryOrganizationSlug !== __user.organization.slug)
        ? throwForbiddenExceptionForCorruptedOrganizationCtx()
        : reqUserOrganizationSlug;

    if (!(isUUID(reqOrganizationIdCtx) || reqOrganizationSlugCtx)) {
      throw new UnprocessableEntityException({
        statusCode: EnumRequestStatusCodeError.RequestValidationError,
        message: 'http.clientError.unprocessableEntity',
      });
    }

    return { id: reqOrganizationIdCtx, slug: reqOrganizationSlugCtx };
  },
);

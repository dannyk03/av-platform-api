import { SYSTEM_ORGANIZATION_NAME } from '@/system';
import { EnumRequestStatusCodeError } from '@/utils/request';
import {
  createParamDecorator,
  ExecutionContext,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { IReqOrganizationIdentifierCtx } from './organization.interface';
import { slugify } from '@/utils/helper';

export const ReqOrganizationIdentifierCtx = createParamDecorator(
  (data: string, ctx: ExecutionContext): IReqOrganizationIdentifierCtx => {
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
        : reqUserOrganizationId;

    const reqOrganizationSlugCtx: string | undefined =
      reqUserOrganizationName === SYSTEM_ORGANIZATION_NAME
        ? bodyOrganizationSlug || queryOrganizationSlug
          ? slugify(bodyOrganizationSlug) || slugify(queryOrganizationSlug)
          : !(bodyOrganizationId || queryOrganizationId)
          ? reqUserOrganizationSlug
          : undefined
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

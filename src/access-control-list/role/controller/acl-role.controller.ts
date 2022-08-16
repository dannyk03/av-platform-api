import {
  Controller,
  Get,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';
import {
  EnumOrganizationStatusCodeError,
  IResponsePagingData,
} from '@avo/type';

import { ILike } from 'typeorm';

import { AclRoleService } from '../service';
import { OrganizationService } from '@/organization/service';
import { PaginationService } from '@/utils/pagination/service';

import { RoleGetSerialization } from '../serialization/acl-role.get.serialization';

import { AclRoleListDto } from '../dto';

import { AclGuard } from '@/auth';
import {
  IReqOrganizationIdentifierCtx,
  ReqOrganizationIdentifierCtx,
} from '@/organization';
import { ResponsePaging } from '@/utils/response';

@Controller({
  version: '1',
  path: 'role',
})
export class AclRoleController {
  constructor(
    private readonly aclRoleService: AclRoleService,
    private readonly organizationService: OrganizationService,
    private readonly paginationService: PaginationService,
  ) {}

  @ResponsePaging('role.list')
  @AclGuard({
    abilities: [
      {
        action: Action.Read,
        subject: Subjects.Role,
      },
    ],
  })
  @Get('/list')
  async list(
    @Query()
    {
      page,
      perPage,
      sort,
      search,
      availableSort,
      availableSearch,
    }: AclRoleListDto,
    @ReqOrganizationIdentifierCtx()
    { id, slug }: IReqOrganizationIdentifierCtx,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);
    const organizationCtxFind: Record<string, any> = {
      organization: { id, slug },
    };

    const roles = await this.aclRoleService.findAll(
      { ...organizationCtxFind, name: search && ILike(`%${search}%`) },
      {
        skip: skip,
        take: perPage,
        order: sort,
      },
    );

    if (!roles.length) {
      const reqOrganization = await this.organizationService.findOne({
        where: organizationCtxFind.organization,
      });

      if (!reqOrganization) {
        throw new UnprocessableEntityException({
          statusCode: EnumOrganizationStatusCodeError.OrganizationNotFoundError,
          message: 'http.clientError.unprocessableEntity',
        });
      }
    }

    const totalData =
      roles &&
      (await this.aclRoleService.getTotal({
        ...organizationCtxFind,
        name: search && ILike(`%${search}%`),
      }));

    const totalPage = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data: RoleGetSerialization[] =
      await this.aclRoleService.serializationList(roles);

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data,
    };
  }
}

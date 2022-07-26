import {
  Controller,
  Get,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';

import { ILike } from 'typeorm';

import { Action, Subject } from '@avo/casl';

import { AclRoleService } from '../service';
import { OrganizationService } from '@/organization/service';
import { PaginationService } from '@/utils/pagination/service';

import { RoleListSerialization } from '../serialization/acl-role.list.serialization';

import { AclRoleListDto } from '../dto';

import { AclGuard } from '@/auth';
import {
  EnumOrganizationStatusCodeError,
  IReqOrganizationIdentifierCtx,
  ReqOrganizationIdentifierCtx,
} from '@/organization';
import { IResponsePaging, ResponsePaging } from '@/utils/response';

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
        subject: Subject.Role,
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
  ): Promise<IResponsePaging> {
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

    const totalData: number =
      roles &&
      (await this.aclRoleService.getTotal({
        ...organizationCtxFind,
        name: search && ILike(`%${search}%`),
      }));

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data: RoleListSerialization[] =
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

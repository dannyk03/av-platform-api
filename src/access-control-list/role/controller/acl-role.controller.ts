import {
  Controller,
  Get,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Subject, Action } from '@avo/casl';
// Services
import { DebuggerService } from '@/debugger/service';
import { PaginationService } from '@/utils/pagination/service';
import { AclRoleService } from '../service';
import { OrganizationService } from '@/organization/service';
//
import { ResponsePaging, IResponsePaging } from '@/utils/response';
import { AclGuard } from '@/auth';
import { AclRoleListDto } from '../dto';
import { ILike } from 'typeorm';
import { RoleListSerialization } from '../serialization/acl-role.list.serialization';
import {
  EnumOrganizationStatusCodeError,
  IReqOrganizationIdentifierCtx,
  ReqOrganizationIdentifierCtx,
} from '@/organization';

@Controller({
  version: '1',
  path: 'role',
})
export class AclRoleController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly aclRoleService: AclRoleService,
    private readonly organizationService: OrganizationService,
    private readonly paginationService: PaginationService,
  ) {}

  @ResponsePaging('role.list')
  @AclGuard([
    {
      action: Action.Read,
      subject: Subject.Role,
    },
  ])
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

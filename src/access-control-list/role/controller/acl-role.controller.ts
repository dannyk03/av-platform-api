import { Controller, Get, Query } from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service';
import { PaginationService } from '@/utils/pagination/service';
import { AclRoleService } from '../service';
//
import { ResponsePaging, IResponsePaging } from '@/utils/response';
import { EnumAclAbilityAction } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { AclGuard } from '@/auth';
import { AclRoleListDto } from '../dto';
import { ILike } from 'typeorm';
import { RoleListSerialization } from '../serialization/acl-role.list.serialization';
import {
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
    private readonly paginationService: PaginationService,
  ) {}

  @ResponsePaging('role.list')
  @AclGuard({
    action: EnumAclAbilityAction.Read,
    subject: AclSubjectTypeDict.Role,
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

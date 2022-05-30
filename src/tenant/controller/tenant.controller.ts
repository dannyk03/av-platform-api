import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  // NotFoundException,
  Patch,
  Post,
  // Put,
  Query,
} from '@nestjs/common';
// import { AuthAdminJwtGuard } from 'src/auth/auth.decorator';
// import { PermissionService } from 'src/permission/service/permission.service';
import { TenantService } from '../service/tenant.service';
import {
  GetTenant,
  TenantDeleteGuard,
  TenantGetGuard,
  TenantUpdateActiveGuard,
  TenantUpdateGuard,
  TenantUpdateInactiveGuard,
} from '../tenant.decorator';
import { ITenantDocument } from '../tenant.interface';
import { ENUM_TENANT_STATUS_CODE_ERROR } from '../tenant.constant';
import { Response, ResponsePaging } from '@/utils/response/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/utils/response/response.interface';
import { ENUM_STATUS_CODE_ERROR } from '@/utils/error/error.constant';
import { PaginationService } from '@/utils/pagination/service/pagination.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { TenantDocument } from '../schema/tenant.schema';
import { TenantListDto } from '../dto/tenant.list.dto';
import { TenantCreateDto } from '../dto/tenant.create.dto';
// import { TenantUpdateDto } from '../dto/tenant.update.dto';
import { TenantListSerialization } from '../serialization/tenant.list.serialization';
import { TenantRequestDto } from '../dto/tenant.request.dto';
import { RequestParamGuard } from 'src/utils/request/request.decorator';

@Controller({
  path: '/tenant',
})
export class TenantController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly paginationService: PaginationService,
    private readonly tenantService: TenantService, // private readonly permissionService: PermissionService,
  ) {}

  @ResponsePaging('tenant.list')
  // @AuthAdminJwtGuard(ENUM_PERMISSIONS.TENANT_READ)
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
    }: TenantListDto,
  ): Promise<IResponsePaging> {
    const skip: number = await this.paginationService.skip(page, perPage);
    const find: Record<string, any> = {};
    if (search) {
      find['$or'] = [
        {
          name: {
            $regex: new RegExp(search),
            $options: 'i',
          },
        },
      ];
    }

    const tenants: TenantDocument[] = await this.tenantService.findAll(find, {
      skip: skip,
      limit: perPage,
      sort,
    });

    const totalData: number = await this.tenantService.getTotal({});
    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data: TenantListSerialization[] =
      await this.tenantService.serializationList(tenants);

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

  @Response('tenant.get')
  @TenantGetGuard()
  @RequestParamGuard(TenantRequestDto)
  // @AuthAdminJwtGuard(ENUM_PERMISSIONS.TENANT_READ)
  @Get('get/:slug')
  async get(@GetTenant() slug: ITenantDocument): Promise<IResponse> {
    return this.tenantService.serializationGet(slug);
  }

  @Response('tenant.create')
  // @AuthAdminJwtGuard(
  //   ENUM_PERMISSIONS.TENANT_READ,
  //   ENUM_PERMISSIONS.TENANT_CREATE,
  // )
  @Post('/create')
  async create(
    @Body()
    { name }: TenantCreateDto,
  ): Promise<IResponse> {
    const exist: boolean = await this.tenantService.exists(name);
    if (exist) {
      this.debuggerService.error('Tenant Error', 'TenantController', 'create');

      throw new BadRequestException({
        statusCode: ENUM_TENANT_STATUS_CODE_ERROR.TENANT_EXIST_ERROR,
        message: 'tenant.error.exist',
      });
    }

    try {
      const create = await this.tenantService.create({
        name,
      });

      return {
        slug: create.slug,
      };
    } catch (err: any) {
      this.debuggerService.error(
        'create try catch',
        'TenantController',
        'create',
        err,
      );

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @Response('tenant.update')
  @TenantUpdateGuard()
  @RequestParamGuard(TenantRequestDto)
  // @AuthAdminJwtGuard(
  //   ENUM_PERMISSIONS.TENANT_READ,
  //   ENUM_PERMISSIONS.TENANT_UPDATE,
  // )
  // @Put('/update/:slug')
  // async update(
  //   @Body()
  //   { name }: TenantUpdateDto,
  // ): Promise<IResponse> {
  //   const check: boolean = await this.tenantService.exists(name, tenant._id);
  //   if (check) {
  //     this.debuggerService.error(
  //       'Tenant Exist Error',
  //       'TenantController',
  //       'update',
  //     );

  //     throw new BadRequestException({
  //       statusCode: ENUM_TENANT_STATUS_CODE_ERROR.TENANT_EXIST_ERROR,
  //       message: 'tenant.error.exist',
  //     });
  //   }

  //   try {
  //     await this.tenantService.update(slug, {
  //       name,
  //       permissions,
  //       isAdmin,
  //     });
  //   } catch (e) {
  //     this.debuggerService.error(
  //       'Project server internal error',
  //       'SurveyAdminController',
  //       'update',
  //       e,
  //     );

  //     throw new InternalServerErrorException({
  //       statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
  //       message: 'http.serverError.internalServerError',
  //     });
  //   }

  //   return {
  //     _id: tenant._id,
  //   };
  // }
  @Response('tenant.delete')
  @TenantDeleteGuard()
  @RequestParamGuard(TenantRequestDto)
  // @AuthAdminJwtGuard(
  //   ENUM_PERMISSIONS.TENANT_READ,
  //   ENUM_PERMISSIONS.TENANT_DELETE,
  // )
  @Delete('/delete/:slug')
  async delete(@GetTenant() tenant: ITenantDocument): Promise<void> {
    try {
      await this.tenantService.deleteOneBySlug(tenant._id);
    } catch (err) {
      this.debuggerService.error(
        'delete try catch',
        'TenantController',
        'delete',
        err,
      );
      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
    return;
  }

  @Response('tenant.inactive')
  @TenantUpdateInactiveGuard()
  @RequestParamGuard(TenantRequestDto)
  // @AuthAdminJwtGuard(
  //   ENUM_PERMISSIONS.TENANT_READ,
  //   ENUM_PERMISSIONS.TENANT_UPDATE,
  // )
  @Patch('/update/:tenant/inactive')
  async inactive(@GetTenant() tenant: ITenantDocument): Promise<void> {
    try {
      await this.tenantService.inactive(tenant._id);
    } catch (e) {
      this.debuggerService.error(
        'Tenant inactive server internal error',
        'TenantController',
        'inactive',
        e,
      );

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return;
  }

  @Response('tenant.active')
  @TenantUpdateActiveGuard()
  @RequestParamGuard(TenantRequestDto)
  // @AuthAdminJwtGuard(
  //   ENUM_PERMISSIONS.TENANT_READ,
  //   ENUM_PERMISSIONS.TENANT_UPDATE,
  // )
  @Patch('/update/:tenant/active')
  async active(@GetTenant() tenant: ITenantDocument): Promise<void> {
    try {
      await this.tenantService.active(tenant._id);
    } catch (e) {
      this.debuggerService.error(
        'Tenant active server internal error',
        'TenantController',
        'active',
        e,
      );

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return;
  }
}

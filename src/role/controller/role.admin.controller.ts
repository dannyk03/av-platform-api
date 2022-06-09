import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ENUM_PERMISSIONS,
  ENUM_PERMISSION_STATUS_CODE_ERROR,
} from 'src/permission/permission.constant';
import { AuthAdminJwtGuard } from 'src/auth/auth.decorator';
import { PermissionService } from 'src/permission/service/permission.service';
import { RoleService } from '../service/role.service';
import {
  GetRole,
  RoleDeleteGuard,
  RoleGetGuard,
  RoleUpdateActiveGuard,
  RoleUpdateGuard,
  RoleUpdateInactiveGuard,
} from '../role.decorator';
import { IRoleEntity } from '../role.interface';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../role.constant';
import {
  Response,
  ResponsePaging,
} from 'src/utils/response/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/utils/response/response.interface';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { PaginationService } from 'src/utils/pagination/service/pagination.service';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { Role } from '../entity/role.entity';
import { Permission } from '@/permission/entity/permission.entity';
import { RoleListDto } from '../dto/role.list.dto';
import { RoleCreateDto } from '../dto/role.create.dto';
import { RoleUpdateDto } from '../dto/role.update.dto';
import { RoleListSerialization } from '../serialization/role.list.serialization';
import { RoleRequestDto } from '../dto/role.request.dto';
import { RequestParamGuard } from 'src/utils/request/request.decorator';

@Controller({
  version: '1',
  path: 'role',
})
export class RoleAdminController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly paginationService: PaginationService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  @ResponsePaging('role.list')
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ)
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
    }: RoleListDto,
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

    const roles: Role[] = await this.roleService.findAll(find, {
      skip: skip,
      limit: perPage,
      sort,
    });

    const totalData: number = await this.roleService.getTotal({});
    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data: RoleListSerialization[] =
      await this.roleService.serializationList(roles);

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

  @Response('role.get')
  @RoleGetGuard()
  @RequestParamGuard(RoleRequestDto)
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ)
  @Get('get/:role')
  async get(@GetRole() role: IRoleEntity): Promise<IResponse> {
    return this.roleService.serializationGet(role);
  }

  @Response('role.create')
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_CREATE)
  @Post('/create')
  async create(
    @Body()
    { name, permissions }: RoleCreateDto,
  ): Promise<IResponse> {
    const exist: boolean = await this.roleService.exists(name);
    if (exist) {
      this.debuggerService.error('Role Error', 'RoleController', 'create');

      throw new BadRequestException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
        message: 'role.error.exist',
      });
    }

    for (const permission of permissions) {
      const checkPermission: Permission =
        await this.permissionService.findOneById(permission);

      if (!checkPermission) {
        this.debuggerService.error(
          'Permission not found',
          'RoleController',
          'create',
        );

        throw new NotFoundException({
          statusCode:
            ENUM_PERMISSION_STATUS_CODE_ERROR.PERMISSION_NOT_FOUND_ERROR,
          message: 'permission.error.notFound',
        });
      }
    }

    try {
      const create = await this.roleService.create({
        name,
        permissions,
      });

      return {
        id: create.id,
      };
    } catch (err: any) {
      this.debuggerService.error(
        'create try catch',
        'RoleController',
        'create',
        err,
      );

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }

  @Response('role.update')
  @RoleUpdateGuard()
  @RequestParamGuard(RoleRequestDto)
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_UPDATE)
  @Put('/update/:role')
  async update(
    @GetRole() role: Role,
    @Body()
    { name, permissions }: RoleUpdateDto,
  ): Promise<IResponse> {
    const check: boolean = await this.roleService.exists(name, role.id);
    if (check) {
      this.debuggerService.error(
        'Role Exist Error',
        'RoleController',
        'update',
      );

      throw new BadRequestException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
        message: 'role.error.exist',
      });
    }

    for (const permission of permissions) {
      const checkPermission: Permission =
        await this.permissionService.findOneById(permission);

      if (!checkPermission) {
        this.debuggerService.error(
          'Permission not found',
          'RoleController',
          'update',
        );

        throw new NotFoundException({
          statusCode:
            ENUM_PERMISSION_STATUS_CODE_ERROR.PERMISSION_NOT_FOUND_ERROR,
          message: 'permission.error.notFound',
        });
      }
    }

    try {
      await this.roleService.update(role.id, {
        name,
        permissions,
      });
    } catch (e) {
      this.debuggerService.error(
        'Project server internal error',
        'SurveyAdminController',
        'update',
        e,
      );

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return {
      id: role.id,
    };
  }

  @Response('role.delete')
  @RoleDeleteGuard()
  @RequestParamGuard(RoleRequestDto)
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_DELETE)
  @Delete('/delete/:role')
  async delete(@GetRole() role: IRoleEntity): Promise<void> {
    try {
      await this.roleService.deleteOneById(role.id);
    } catch (err) {
      this.debuggerService.error(
        'delete try catch',
        'RoleController',
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

  @Response('role.inactive')
  @RoleUpdateInactiveGuard()
  @RequestParamGuard(RoleRequestDto)
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_UPDATE)
  @Patch('/update/:role/inactive')
  async inactive(@GetRole() role: IRoleEntity): Promise<void> {
    try {
      await this.roleService.inactive(role.id);
    } catch (e) {
      this.debuggerService.error(
        'Role inactive server internal error',
        'RoleController',
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

  @Response('role.active')
  @RoleUpdateActiveGuard()
  @RequestParamGuard(RoleRequestDto)
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_UPDATE)
  @Patch('/update/:role/active')
  async active(@GetRole() role: IRoleEntity): Promise<void> {
    try {
      await this.roleService.active(role.id);
    } catch (e) {
      this.debuggerService.error(
        'Role active server internal error',
        'RoleController',
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

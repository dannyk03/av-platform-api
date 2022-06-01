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
    Permissions,
    PermissionsStatusCodeError,
} from '@/permission/permission.constant';
import { AuthAdminJwtGuard } from '@/auth/auth.decorator';
import { PermissionService } from '@/permission/service/permission.service';
import { RoleService } from '../service/role.service';
import {
    GetRole,
    RoleDeleteGuard,
    RoleGetGuard,
    RoleUpdateActiveGuard,
    RoleUpdateGuard,
    RoleUpdateInactiveGuard,
} from '../role.decorator';
import { IRoleDocument } from '../role.interface';
import { RoleStatusCodeError } from '../role.constant';
import { Response, ResponsePaging } from '@/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from '@/utils/response/response.interface';
import { StatusCodeError } from '@/utils/error/error.constant';
import { PaginationService } from '@/utils/pagination/service/pagination.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { RoleDocument } from '../schema/role.schema';
import { PermissionDocument } from '@/permission/schema/permission.schema';
import { RoleListDto } from '../dto/role.list.dto';
import { RoleCreateDto } from '../dto/role.create.dto';
import { RoleUpdateDto } from '../dto/role.update.dto';
import { RoleListSerialization } from '../serialization/role.list.serialization';
import { RoleGetDto } from '../dto/role.get.dto';
import { RequestParamGuard } from '@/utils/request/request.decorator';

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
    @AuthAdminJwtGuard(Permissions.RoleRead)
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

        const roles: RoleDocument[] = await this.roleService.findAll(find, {
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
    @RequestParamGuard(RoleGetDto)
    @AuthAdminJwtGuard(Permissions.RoleRead)
    @Get('get/:role')
    async get(@GetRole() role: IRoleDocument): Promise<IResponse> {
        return this.roleService.serializationGet(role);
    }

    @Response('role.create')
    @AuthAdminJwtGuard(Permissions.RoleRead, Permissions.RoleCreate)
    @Post('/create')
    async create(
        @Body()
        { name, permissions }: RoleCreateDto,
    ): Promise<IResponse> {
        const exist: boolean = await this.roleService.exists(name);
        if (exist) {
            this.debuggerService.error(
                'Role Error',
                'RoleController',
                'create',
            );

            throw new BadRequestException({
                statusCode: RoleStatusCodeError.RoleExistError,
                message: 'role.error.exist',
            });
        }

        for (const permission of permissions) {
            const checkPermission: PermissionDocument =
                await this.permissionService.findOneById(permission);

            if (!checkPermission) {
                this.debuggerService.error(
                    'Permission not found',
                    'RoleController',
                    'create',
                );

                throw new NotFoundException({
                    statusCode: PermissionsStatusCodeError.NotFoundError,
                    message: 'permission.error.notFound',
                });
            }
        }

        try {
            const create = await this.roleService.create({
                name,
                code: name,
                permissions,
            });

            return {
                _id: create._id,
            };
        } catch (err: any) {
            this.debuggerService.error(
                'create try catch',
                'RoleController',
                'create',
                err,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    @Response('role.update')
    @RoleUpdateGuard()
    @RequestParamGuard(RoleGetDto)
    @AuthAdminJwtGuard(Permissions.RoleRead, Permissions.RoleUpdate)
    @Put('/update/:role')
    async update(
        @GetRole() role: RoleDocument,
        @Body()
        { name, permissions }: RoleUpdateDto,
    ): Promise<IResponse> {
        const check: boolean = await this.roleService.exists(name, role._id);
        if (check) {
            this.debuggerService.error(
                'Role Exist Error',
                'RoleController',
                'update',
            );

            throw new BadRequestException({
                statusCode: RoleStatusCodeError.RoleExistError,
                message: 'role.error.exist',
            });
        }

        for (const permission of permissions) {
            const checkPermission: PermissionDocument =
                await this.permissionService.findOneById(permission);

            if (!checkPermission) {
                this.debuggerService.error(
                    'Permission not found',
                    'RoleController',
                    'update',
                );

                throw new NotFoundException({
                    statusCode: PermissionsStatusCodeError.NotFoundError,
                    message: 'permission.error.notFound',
                });
            }
        }

        try {
            await this.roleService.update(role._id, {
                name,
                permissions,
                code: name,
            });
        } catch (e) {
            this.debuggerService.error(
                'Project server internal error',
                'SurveyAdminController',
                'update',
                e,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: role._id,
        };
    }

    @Response('role.delete')
    @RoleDeleteGuard()
    @RequestParamGuard(RoleGetDto)
    @AuthAdminJwtGuard(Permissions.RoleRead, Permissions.RoleDelete)
    @Delete('/delete/:role')
    async delete(@GetRole() role: IRoleDocument): Promise<void> {
        try {
            await this.roleService.deleteOneById(role._id);
        } catch (err) {
            this.debuggerService.error(
                'delete try catch',
                'RoleController',
                'delete',
                err,
            );
            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }
        return;
    }

    @Response('role.inactive')
    @RoleUpdateInactiveGuard()
    @RequestParamGuard(RoleGetDto)
    @AuthAdminJwtGuard(Permissions.RoleRead, Permissions.RoleUpdate)
    @Patch('/update/:role/inactive')
    async inactive(@GetRole() role: IRoleDocument): Promise<void> {
        try {
            await this.roleService.inactive(role._id);
        } catch (e) {
            this.debuggerService.error(
                'Role inactive server internal error',
                'RoleController',
                'inactive',
                e,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }

    @Response('role.active')
    @RoleUpdateActiveGuard()
    @RequestParamGuard(RoleGetDto)
    @AuthAdminJwtGuard(Permissions.RoleRead, Permissions.RoleUpdate)
    @Patch('/update/:role/active')
    async active(@GetRole() role: IRoleDocument): Promise<void> {
        try {
            await this.roleService.active(role._id);
        } catch (e) {
            this.debuggerService.error(
                'Role active server internal error',
                'RoleController',
                'active',
                e,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}

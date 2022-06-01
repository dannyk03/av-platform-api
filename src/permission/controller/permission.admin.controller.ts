import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Patch,
    Put,
    Query,
} from '@nestjs/common';
import { Permissions } from '@/permission';
import { AuthAdminJwtGuard } from '@/auth/auth.decorator';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { PermissionService } from '../service/permission.service';
import {
    GetPermission,
    PermissionGetGuard,
    PermissionUpdateActiveGuard,
    PermissionUpdateGuard,
    PermissionUpdateInactiveGuard,
} from '../permission.decorator';
import { Response, ResponsePaging } from '@/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from '@/utils/response/response.interface';
import { StatusCodeError } from '@/utils/error/error.constant';
import { PaginationService } from '@/utils/pagination/service/pagination.service';
import { PermissionDocument } from '../schema/permission.schema';
import { PermissionListDto } from '../dto/permission.list.dto';
import { PermissionUpdateDto } from '../dto/permission.update.dto';
import { PermissionListSerialization } from '../serialization/permission.list.serialization';
import { RequestParamGuard } from '@/utils/request/request.decorator';
import { PermissionGetDto } from '../dto/permissions.request.dto';

@Controller({
    version: '1',
    path: 'permission',
})
export class PermissionAdminController {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly paginationService: PaginationService,
        private readonly permissionService: PermissionService,
    ) {}

    @ResponsePaging('permission.list')
    // @AuthAdminJwtGuard(Permission.PermissionsRead)
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
            isActive,
        }: PermissionListDto,
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {
            isActive: {
                $in: isActive,
            },
        };
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

        const permissions: PermissionDocument[] =
            await this.permissionService.findAll(find, {
                skip: skip,
                limit: perPage,
                sort,
            });

        const totalData: number = await this.permissionService.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage,
        );

        const data: PermissionListSerialization[] =
            await this.permissionService.serializationList(permissions);

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

    @Response('permission.get')
    @PermissionGetGuard()
    @RequestParamGuard(PermissionGetDto)
    // @AuthAdminJwtGuard(Permission.PermissionsRead)
    @Get('/get/:permission')
    async get(
        @GetPermission() permission: PermissionDocument,
    ): Promise<IResponse> {
        return this.permissionService.serializationGet(permission);
    }

    @Response('permission.update')
    @PermissionUpdateGuard()
    @RequestParamGuard(PermissionGetDto)
    // @AuthAdminJwtGuard(
    //     Permission.PermissionsRead,
    //     Permission.PermissionsUpdate,
    // )
    @Put('/update/:permission')
    async update(
        @GetPermission() permission: PermissionDocument,
        @Body() body: PermissionUpdateDto,
    ): Promise<IResponse> {
        try {
            await this.permissionService.update(permission._id, body);
        } catch (e) {
            this.debuggerService.error(
                'Auth active server internal error',
                'AuthAdminController',
                'updateActive',
                e,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: permission._id,
        };
    }

    @Response('permission.inactive')
    @PermissionUpdateInactiveGuard()
    @RequestParamGuard(PermissionGetDto)
    // @AuthAdminJwtGuard(
    //     Permissions.PermissionsRead,
    //     Permissions.PermissionsUpdate,
    // )
    @Patch('/update/:permission/inactive')
    async inactive(
        @GetPermission() permission: PermissionDocument,
    ): Promise<void> {
        try {
            await this.permissionService.inactive(permission._id);
        } catch (e) {
            this.debuggerService.error(
                'Permission inactive server internal error',

                'PermissionController',
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

    @Response('permission.active')
    @PermissionUpdateActiveGuard()
    @RequestParamGuard(PermissionGetDto)
    // @AuthAdminJwtGuard(
    //     Permissions.PermissionsRead,
    //     Permissions.PermissionsUpdate,
    // )
    @Patch('/update/:permission/active')
    async active(
        @GetPermission() permission: PermissionDocument,
    ): Promise<void> {
        try {
            await this.permissionService.active(permission._id);
        } catch (e) {
            this.debuggerService.error(
                'Permission active server internal error',
                'PermissionController',
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

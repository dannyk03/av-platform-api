import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { AuthAdminJwtGuard } from '@/auth/auth.decorator';
import { PermissionService } from '@/permission/service/permission.service';
import { OrganizationService } from '../service/organization.service';
import {
    GetOrganization,
    OrganizationDeleteGuard,
    OrganizationGetGuard,
    OrganizationUpdateActiveGuard,
    OrganizationUpdateGuard,
    OrganizationUpdateInactiveGuard,
} from '../organization.decorator';
import { IOrganizationDocument } from '../organization.interface';
import { ENUM_ORGANIZATION_STATUS_CODE_ERROR } from '../organization.constant';
import { Response, ResponsePaging } from '@/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from '@/utils/response/response.interface';
import { ENUM_STATUS_CODE_ERROR } from '@/utils/error/error.constant';
import { PaginationService } from '@/utils/pagination/service/pagination.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { OrganizationDocument } from '../schema/organization.schema';
import {
    OrganizationCreateDto,
    OrganizationUpdateDto,
    OrganizationListDto,
    OrganizationGetDto,
} from '../dto';
import { OrganizationListSerialization } from '../serialization/organization.list.serialization';
import { RequestParamGuard } from '@/utils/request/request.decorator';
import { Permissions } from '@/permission';

@Controller({
    version: '1',
})
export class OrganizationController {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly paginationService: PaginationService,
        private readonly organizationService: OrganizationService,
        private readonly permissionService: PermissionService,
    ) {}

    @ResponsePaging('organization.list')
    @AuthAdminJwtGuard(Permissions.OrganizationRead)
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
        }: OrganizationListDto,
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

        const arganizations: OrganizationDocument[] =
            await this.organizationService.findAll(find, {
                skip: skip,
                limit: perPage,
                sort,
            });

        const totalData: number = await this.organizationService.getTotal({});
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage,
        );

        const data: OrganizationListSerialization[] =
            await this.organizationService.serializationList(arganizations);

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

    @Response('organization.get')
    @OrganizationGetGuard()
    @RequestParamGuard(OrganizationGetDto)
    @AuthAdminJwtGuard(Permissions.OrganizationRead)
    @Get('get/:slug')
    async get(
        @GetOrganization() slug: IOrganizationDocument,
    ): Promise<IResponse> {
        return this.organizationService.serializationGet(slug);
    }

    @Response('organization.create')
    @AuthAdminJwtGuard(
        Permissions.OrganizationRead,
        Permissions.OrganizationCreate,
    )
    @Post('/create')
    async create(
        @Body()
        { name }: OrganizationCreateDto,
    ): Promise<IResponse> {
        const exist: boolean = await this.organizationService.exists(name);
        if (exist) {
            this.debuggerService.error(
                'Organization Error',
                'OrganizationController',
                'create',
            );

            throw new BadRequestException({
                statusCode:
                    ENUM_ORGANIZATION_STATUS_CODE_ERROR.ORGANIZATION_EXIST_ERROR,
                message: 'organization.error.exist',
            });
        }

        try {
            const create = await this.organizationService.create({
                name,
            });

            return {
                slug: create.slug,
            };
        } catch (err: any) {
            this.debuggerService.error(
                'create try catch',
                'OrganizationController',
                'create',
                err,
            );

            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    @Response('organization.update')
    @OrganizationUpdateGuard()
    @RequestParamGuard(OrganizationUpdateDto)
    @AuthAdminJwtGuard(
        Permissions.OrganizationRead,
        Permissions.OrganizationUpdate,
    )
    @Put('/update/:slug')
    async update(
        @Body()
        { name }: OrganizationUpdateDto,
        @Param('slug')
        slug: string,
    ): Promise<IResponse> {
        const check: boolean = await this.organizationService.exists(name);
        if (check) {
            this.debuggerService.error(
                'Organization Exist Error',
                'OrganizationController',
                'update',
            );

            throw new BadRequestException({
                statusCode:
                    ENUM_ORGANIZATION_STATUS_CODE_ERROR.ORGANIZATION_EXIST_ERROR,
                message: 'organization.error.exist',
            });
        }

        try {
            await this.organizationService.update(slug, {
                name,
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
            // _id: organization._id,
        };
    }
    @Response('organization.delete')
    @OrganizationDeleteGuard()
    @RequestParamGuard(OrganizationGetDto)
    @AuthAdminJwtGuard(
        Permissions.OrganizationRead,
        Permissions.OrganizationDelete,
    )
    @Delete('/delete/:slug')
    async delete(
        @GetOrganization() organization: IOrganizationDocument,
    ): Promise<void> {
        try {
            await this.organizationService.deleteOneBySlug(organization._id);
        } catch (err) {
            this.debuggerService.error(
                'delete try catch',
                'OrganizationController',
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

    @Response('organization.inactive')
    @OrganizationUpdateInactiveGuard()
    @RequestParamGuard(OrganizationGetDto)
    // @AuthAdminJwtGuard(
    //   ENUM_PERMISSIONS.ORGANIZATION_READ,
    //   ENUM_PERMISSIONS.ORGANIZATION_UPDATE,
    // )
    @Patch('/update/:organization/inactive')
    async inactive(
        @GetOrganization() organization: IOrganizationDocument,
    ): Promise<void> {
        try {
            await this.organizationService.inactive(organization._id);
        } catch (e) {
            this.debuggerService.error(
                'Organization inactive server internal error',
                'OrganizationController',
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

    @Response('organization.active')
    @OrganizationUpdateActiveGuard()
    @RequestParamGuard(OrganizationGetDto)
    @AuthAdminJwtGuard(
        Permissions.OrganizationRead,
        Permissions.OrganizationUpdate,
    )
    @Patch('/update/:organization/active')
    async active(
        @GetOrganization() organization: IOrganizationDocument,
    ): Promise<void> {
        try {
            await this.organizationService.active(organization._id);
        } catch (e) {
            this.debuggerService.error(
                'Organization active server internal error',
                'OrganizationController',
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

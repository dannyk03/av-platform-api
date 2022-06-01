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
import { OrganizationStatusCodeError } from '@/organization';
import { IUserCheckExist, UserStatusCodeError } from '@/user';
import { Response, ResponsePaging } from '@/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from '@/utils/response/response.interface';
import { StatusCodeError } from '@/utils/error/error.constant';
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
import { UserService } from '@/user';
import { HelperSlugService } from '@/utils/helper/service/helper.slug.service';
import { Connection } from 'mongoose';
import { DatabaseConnection } from '@/database';
import { RoleService, RoleStatusCodeError } from '@/role';

@Controller({
    version: '1',
})
export class OrganizationController {
    constructor(
        @DatabaseConnection()
        private readonly databaseConnection: Connection,
        private readonly debuggerService: DebuggerService,
        private readonly paginationService: PaginationService,
        private readonly organizationService: OrganizationService,
        private readonly permissionService: PermissionService,
        private readonly userService: UserService,
        private readonly helperSlugService: HelperSlugService,
        private readonly roleService: RoleService,
    ) {}

    // @ResponsePaging('organization.list')
    // @AuthAdminJwtGuard(Permission.OrganizationRead)
    // @Get('/list')
    // async list(
    //     @Query()
    //     {
    //         page,
    //         perPage,
    //         sort,
    //         search,
    //         availableSort,
    //         availableSearch,
    //     }: OrganizationListDto,
    // ): Promise<IResponsePaging> {
    //     const skip: number = await this.paginationService.skip(page, perPage);
    //     const find: Record<string, any> = {};
    //     if (search) {
    //         find['$or'] = [
    //             {
    //                 name: {
    //                     $regex: new RegExp(search),
    //                     $options: 'i',
    //                 },
    //             },
    //         ];
    //     }

    //     const organizations: OrganizationDocument[] =
    //         await this.organizationService.findAll(find, {
    //             skip: skip,
    //             limit: perPage,
    //             sort,
    //         });

    //     const totalData: number = await this.organizationService.getTotal({});
    //     const totalPage: number = await this.paginationService.totalPage(
    //         totalData,
    //         perPage,
    //     );

    //     const data: OrganizationListSerialization[] =
    //         await this.organizationService.serializationList(organizations);

    //     return {
    //         totalData,
    //         totalPage,
    //         currentPage: page,
    //         perPage,
    //         availableSearch,
    //         availableSort,
    //         data,
    //     };
    // }

    // @Response('organization.get')
    // @OrganizationGetGuard()
    // @RequestParamGuard(OrganizationGetDto)
    // @AuthAdminJwtGuard(Permission.OrganizationRead)
    // @Get('get/:slug')
    // async get(
    //     @GetOrganization() slug: IOrganizationDocument,
    // ): Promise<IResponse> {
    //     return this.organizationService.serializationGet(slug);
    // }

    @Response('organization.create')
    // @AuthAdminJwtGuard(
    //     Permission.OrganizationRead,
    //     Permission.OrganizationCreate,
    // )
    @Post('/create')
    async create(
        @Body()
        { name, ownerEmail }: OrganizationCreateDto,
    ): Promise<IResponse> {
        const orgSlug = this.helperSlugService.slugify(name);
        const organizationExists: boolean =
            await this.organizationService.checkExists(orgSlug);
        if (organizationExists) {
            this.debuggerService.error(
                'Organization Error',
                'OrganizationController',
                'create',
            );

            throw new BadRequestException({
                statusCode: OrganizationStatusCodeError.OrganizationExistError,
                message: 'organization.error.exist',
            });
        }

        const userExists: IUserCheckExist = await this.userService.checkExist(
            ownerEmail,
        );
        if (userExists.email) {
            this.debuggerService.error(
                'Owner Error',
                'OrganizationController',
                'create',
            );

            throw new BadRequestException({
                statusCode: UserStatusCodeError.UserEmailExistsError,
                message: 'organization.error.ownerExists',
            });
        }

        const session = await this.databaseConnection.startSession();

        const role = await this.roleService.findOneById(body.role);
        if (!role) {
            this.debuggerService.error(
                'Role not found',
                'UserController',
                'create',
            );

            throw new NotFoundException({
                statusCode: RoleStatusCodeError.RoleNotFoundError,
                message: 'role.error.notFound',
            });
        }

        try {
            session.startTransaction();
            const ownerCreate = await this.userService.create({
                name,
                ownerEmail,
            });

            const orgCreate = await this.organizationService.create({
                name,
                ownerEmail,
            });

            await session.commitTransaction();
            return {
                slug: orgCreate.slug,
            };
        } catch (err: any) {
            await session.abortTransaction();
            this.debuggerService.error(
                'create try catch',
                'OrganizationController',
                'create',
                err,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        } finally {
            session.endSession();
        }
    }

    // @Response('organization.update')
    // @OrganizationUpdateGuard()
    // @RequestParamGuard(OrganizationUpdateDto)
    // @AuthAdminJwtGuard(
    //     Permission.OrganizationRead,
    //     Permission.OrganizationUpdate,
    // )
    // @Put('/update/:slug')
    // async update(
    //     @Body()
    //     { name }: OrganizationUpdateDto,
    //     @Param('slug')
    //     slug: string,
    // ): Promise<IResponse> {
    //     const check: boolean = await this.organizationService.exists(name);
    //     if (check) {
    //         this.debuggerService.error(
    //             'Organization Exist Error',
    //             'OrganizationController',
    //             'update',
    //         );

    //         throw new BadRequestException({
    //             statusCode:
    //                 OrganizationStatusCodeError.OrganizationExistError,
    //             message: 'organization.error.exist',
    //         });
    //     }

    //     try {
    //         await this.organizationService.update(slug, {
    //             name,
    //         });
    //     } catch (e) {
    //         this.debuggerService.error(
    //             'Project server internal error',
    //             'SurveyAdminController',
    //             'update',
    //             e,
    //         );

    //         throw new InternalServerErrorException({
    //             statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
    //             message: 'http.serverError.internalServerError',
    //         });
    //     }

    //     return {
    //         // _id: organization._id,
    //     };
    // }

    // @Response('organization.delete')
    // @OrganizationDeleteGuard()
    // @RequestParamGuard(OrganizationGetDto)
    // @AuthAdminJwtGuard(
    //     Permission.OrganizationRead,
    //     Permission.OrganizationDelete,
    // )
    // @Delete('/delete/:slug')
    // async delete(
    //     @GetOrganization() organization: IOrganizationDocument,
    // ): Promise<void> {
    //     try {
    //         await this.organizationService.deleteOneBySlug(organization._id);
    //     } catch (err) {
    //         this.debuggerService.error(
    //             'delete try catch',
    //             'OrganizationController',
    //             'delete',
    //             err,
    //         );
    //         throw new InternalServerErrorException({
    //             statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
    //             message: 'http.serverError.internalServerError',
    //         });
    //     }
    //     return;
    // }

    // @Response('organization.inactive')
    // @OrganizationUpdateInactiveGuard()
    // @RequestParamGuard(OrganizationGetDto)
    // @AuthAdminJwtGuard(
    //   Permission.OrganizationRead,
    //   Permission.OrganizationUpdate,
    // )
    // @Patch('/update/:slug/inactive')
    // async inactive(
    //     @GetOrganization() organization: IOrganizationDocument,
    // ): Promise<void> {
    //     try {
    //         await this.organizationService.inactive(organization._id);
    //     } catch (e) {
    //         this.debuggerService.error(
    //             'Organization inactive server internal error',
    //             'OrganizationController',
    //             'inactive',
    //             e,
    //         );

    //         throw new InternalServerErrorException({
    //             statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
    //             message: 'http.serverError.internalServerError',
    //         });
    //     }

    //     return;
    // }

    // @Response('organization.active')
    // @OrganizationUpdateActiveGuard()
    // @RequestParamGuard(OrganizationGetDto)
    // @AuthAdminJwtGuard(
    //     Permission.OrganizationRead,
    //     Permission.OrganizationUpdate,
    // )
    // @Patch('/update/:slug/active')
    // async active(
    //     @GetOrganization() organization: IOrganizationDocument,
    // ): Promise<void> {
    //     try {
    //         await this.organizationService.active(organization._id);
    //     } catch (e) {
    //         this.debuggerService.error(
    //             'Organization active server internal error',
    //             'OrganizationController',
    //             'active',
    //             e,
    //         );

    //         throw new InternalServerErrorException({
    //             statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
    //             message: 'http.serverError.internalServerError',
    //         });
    //     }

    //     return;
    // }
}

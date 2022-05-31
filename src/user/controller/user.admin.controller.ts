import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Put,
    Query,
    InternalServerErrorException,
    BadRequestException,
    Patch,
    NotFoundException,
} from '@nestjs/common';
import { Permissions } from '@/permission/permission.constant';
import {
    GetUser,
    UserDeleteGuard,
    UserGetGuard,
    UserUpdateActiveGuard,
    UserUpdateGuard,
    UserUpdateInactiveGuard,
} from '../user.decorator';
import { AuthAdminJwtGuard } from '@/auth/auth.decorator';
import { RoleStatusCodeError } from '@/role/role.constant';
import { UserService } from '../service/user.service';
import { RoleService } from '@/role/service/role.service';
import { IUserCheckExist, IUserDocument } from '../user.interface';
import { UserStatusCodeError } from '../user.constant';
import { PaginationService } from '@/utils/pagination/service/pagination.service';
import { AuthService } from '@/auth/service/auth.service';
import { Response, ResponsePaging } from '@/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from '@/utils/response/response.interface';
import { StatusCodeError } from '@/utils/error/error.constant';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { UserListDto } from '../dto/user.list.dto';
import { UserListSerialization } from '../serialization/user.list.serialization';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserUpdateDto } from '../dto/user.update.dto';
import { RequestParamGuard } from '@/utils/request/request.decorator';
import { UserGetDto } from '../dto/user.get.dto';

@Controller({
    version: '1',
    path: 'user',
})
export class UserAdminController {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly authService: AuthService,
        private readonly paginationService: PaginationService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
    ) {}

    @ResponsePaging('user.list')
    @AuthAdminJwtGuard(Permissions.UserRead)
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
        }: UserListDto,
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};

        if (search) {
            find['$or'] = [
                {
                    firstName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    lastName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    email: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    mobileNumber: search,
                },
            ];
        }
        const users: IUserDocument[] = await this.userService.findAll(find, {
            limit: perPage,
            skip: skip,
            sort,
        });
        const totalData: number = await this.userService.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage,
        );

        const data: UserListSerialization[] =
            await this.userService.serializationList(users);

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

    @Response('user.get')
    @UserGetGuard()
    @RequestParamGuard(UserGetDto)
    @AuthAdminJwtGuard(Permissions.UserRead)
    @Get('get/:user')
    async get(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.userService.serializationGet(user);
    }

    @Response('user.create')
    // @AuthAdminJwtGuard(Permissions.UserRead, Permissions.UserCreate)
    @Post('/create')
    async create(
        @Body()
        body: UserCreateDto,
    ): Promise<IResponse> {
        const checkExist: IUserCheckExist = await this.userService.checkExist(
            body.email,
            // body.mobileNumber,
        );

        if (checkExist.email) {
            this.debuggerService.error(
                'create user exist',
                'UserController',
                'create',
            );

            throw new BadRequestException({
                statusCode: UserStatusCodeError.UserEmailExistsError,
                message: 'user.error.emailExist',
            });
        }
        // else if (checkExist.mobileNumber) {
        //     this.debuggerService.error(
        //         'create user exist',
        //         'UserController',
        //         'create',
        //     );

        //     throw new BadRequestException({
        //         statusCode:
        //             ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
        //         message: 'user.error.mobileNumberExist',
        //     });
        // }

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
            const password = await this.authService.createPassword(
                body.password,
            );

            const create = await this.userService.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                // mobileNumber: body.mobileNumber,
                role: body.role,
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                salt: password.salt,
            });

            return {
                _id: create._id,
            };
        } catch (err: any) {
            this.debuggerService.error(
                'create try catch',
                'UserController',
                'create',
                err,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    @Response('user.delete')
    @UserDeleteGuard()
    @RequestParamGuard(UserGetDto)
    @AuthAdminJwtGuard(Permissions.UserRead, Permissions.UsedDelete)
    @Delete('/delete/:user')
    async delete(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.deleteOneById(user._id);
        } catch (err) {
            this.debuggerService.error(
                'delete try catch',
                'UserController',
                'create',
                err,
            );
            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }

    @Response('user.update')
    @UserUpdateGuard()
    @RequestParamGuard(UserGetDto)
    @AuthAdminJwtGuard(Permissions.UserRead, Permissions.UserUpdate)
    @Put('/update/:user')
    async update(
        @GetUser() user: IUserDocument,
        @Body()
        body: UserUpdateDto,
    ): Promise<IResponse> {
        try {
            await this.userService.updateOneById(user._id, body);
        } catch (err: any) {
            this.debuggerService.error(
                'update try catch',
                'UserController',
                'update',
                err,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: user._id,
        };
    }

    @Response('user.inactive')
    @UserUpdateInactiveGuard()
    @RequestParamGuard(UserGetDto)
    @AuthAdminJwtGuard(Permissions.UserRead, Permissions.UserUpdate)
    @Patch('/update/:user/inactive')
    async inactive(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.inactive(user._id);
        } catch (e) {
            this.debuggerService.error(
                'User inactive server internal error',
                'UserController',
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

    @Response('user.active')
    @UserUpdateActiveGuard()
    @RequestParamGuard(UserGetDto)
    @AuthAdminJwtGuard(Permissions.UserRead, Permissions.UserUpdate)
    @Patch('/update/:user/active')
    async active(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.active(user._id);
        } catch (e) {
            this.debuggerService.error(
                'User active server internal error',
                'UserController',
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

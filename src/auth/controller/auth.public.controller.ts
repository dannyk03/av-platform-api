import {
    BadRequestException,
    Body,
    Controller,
    InternalServerErrorException,
    NotFoundException,
    Post,
} from '@nestjs/common';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { RoleStatusCodeError } from '@/role/role.constant';
import { RoleDocument } from '@/role/schema/role.schema';
import { RoleService } from '@/role/service/role.service';
import { UserService } from '@/user/service/user.service';
import { UserStatusCodeError } from '@/user/user.constant';
import { IUserCheckExist, IUserDocument } from '@/user/user.interface';
import { StatusCodeError } from '@/utils/error/error.constant';
import { Response } from '@/utils/response/response.decorator';
import { IResponse } from '@/utils/response/response.interface';
import { AuthSignUpDto } from '../dto/auth.sign-up.dto';
import { AuthLoginSerialization } from '../serialization/auth.login.serialization';
import { AuthService } from '../service/auth.service';

@Controller({
    version: '1',
    path: '/auth',
})
export class AuthPublicController {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly roleService: RoleService,
    ) {}

    @Response('auth.signUp')
    @Post('/sign-up')
    async signUp(
        @Body()
        { email, ...body }: AuthSignUpDto,
    ): Promise<IResponse> {
        const role: RoleDocument = await this.roleService.findOne<RoleDocument>(
            {
                name: 'user',
            },
        );
        if (!role) {
            this.debuggerService.error(
                'Role not found',
                'AuthController',
                'signUp',
            );

            throw new NotFoundException({
                statusCode: RoleStatusCodeError.RoleNotFoundError,
                message: 'role.error.notFound',
            });
        }

        const checkExist: IUserCheckExist = await this.userService.checkExist(
            email,
        );

        if (checkExist.email) {
            this.debuggerService.error(
                'create user exist',
                'UserController',
                'create',
            );

            throw new BadRequestException({
                statusCode: UserStatusCodeError.UserExistsError,
                message: 'user.error.exist',
            });
        } else if (checkExist.email) {
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

        try {
            const password = await this.authService.createPassword(
                body.password,
            );

            const create = await this.userService.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email,
                role: role._id,
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                salt: password.salt,
            });

            const user: IUserDocument =
                await this.userService.findOneById<IUserDocument>(create._id, {
                    populate: {
                        role: true,
                        permission: true,
                    },
                });
            const safe: AuthLoginSerialization =
                await this.authService.serializationLogin(user);

            const payloadAccessToken: Record<string, any> =
                await this.authService.createPayloadAccessToken(safe, false);
            const payloadRefreshToken: Record<string, any> =
                await this.authService.createPayloadRefreshToken(safe, false, {
                    loginDate: payloadAccessToken.loginDate,
                });

            const accessToken: string =
                await this.authService.createAccessToken(payloadAccessToken);

            const refreshToken: string =
                await this.authService.createRefreshToken(
                    payloadRefreshToken,
                    false,
                );

            return {
                accessToken,
                refreshToken,
            };
        } catch (err: any) {
            this.debuggerService.error(
                'Signup try catch',
                'AuthController',
                'signUp',
                err,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }
    }
}

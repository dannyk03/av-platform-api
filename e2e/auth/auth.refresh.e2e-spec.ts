import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { E2E_AUTH_REFRESH_URL } from './auth.constant';
import { UserStatusCodeError } from '@/user/user.constant';
import { UserDocument } from '@/user/schema/user.schema';
import { RoleDocument } from '@/role/schema/role.schema';
import { AuthStatusCodeError } from '@/auth/auth.constant';
import { RoleStatusCodeError } from '@/role/role.constant';
import { IUserDocument } from '@/user/user.interface';
import { Types, connection } from 'mongoose';
import { CoreModule } from '@/core/core.module';
import { RouterModule } from '@nestjs/core';
import { UserService } from '@/user/service/user.service';
import { AuthService } from '@/auth/service/auth.service';
import { RoleService } from '@/role/service/role.service';
import { HelperDateService } from '@/utils/helper/service/helper.date.service';
import { RouterCommonModule } from '@/router/router.common.module';
import { useContainer } from 'class-validator';
import { AuthApiService } from '@/auth/service/auth.api.service';

describe('E2E Refresh', () => {
    let app: INestApplication;
    let userService: UserService;
    let authService: AuthService;
    let roleService: RoleService;
    let helperDateService: HelperDateService;
    let authApiService: AuthApiService;

    const password = `@!${faker.name.firstName().toLowerCase()}${faker.name
        .firstName()
        .toUpperCase()}${faker.datatype.number({ min: 1, max: 99 })}`;

    const apiKey = 'qwertyuiop12345zxcvbnmkjh';
    let xApiKey: string;
    let timestamp: number;

    let user: UserDocument;
    let passwordExpired: Date;
    let passwordExpiredForward: Date;

    let refreshToken: string;
    let refreshTokenNotFound: string;

    beforeAll(async () => {
        const modRef = await Test.createTestingModule({
            imports: [
                CoreModule,
                RouterCommonModule,
                RouterModule.register([
                    {
                        path: '/',
                        module: RouterCommonModule,
                    },
                ]),
            ],
        }).compile();

        app = modRef.createNestApplication();
        useContainer(app.select(CoreModule), { fallbackOnErrors: true });
        userService = app.get(UserService);
        authService = app.get(AuthService);
        roleService = app.get(RoleService);
        helperDateService = app.get(HelperDateService);
        authApiService = app.get(AuthApiService);

        const role: RoleDocument = await roleService.findOne({
            name: 'user',
        });

        passwordExpired = helperDateService.backwardInDays(5);
        passwordExpiredForward = helperDateService.forwardInDays(5);

        const passwordHash = await authService.createPassword(password);

        user = await userService.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: passwordHash.passwordHash,
            passwordExpired: passwordHash.passwordExpired,
            salt: passwordHash.salt,
            email: faker.internet.email(),
            mobileNumber: faker.phone.phoneNumber('62812#########'),
            role: `${role._id}`,
        });

        const userPopulate = await userService.findOneById<IUserDocument>(
            user._id,
            {
                populate: {
                    role: true,
                    permission: true,
                },
            },
        );

        const map = await authService.serializationLogin(userPopulate);
        const payload = await authService.createPayloadRefreshToken(map, false);
        const payloadNotFound = {
            ...payload,
            _id: `${new Types.ObjectId()}`,
        };

        refreshToken = await authService.createRefreshToken(
            payload,
            false,
            true,
        );
        refreshTokenNotFound = await authService.createRefreshToken(
            payloadNotFound,
            false,
            true,
        );

        timestamp = helperDateService.timestamp();
        const apiEncryption = await authApiService.encryptApiKey(
            {
                key: apiKey,
                timestamp,
                hash: 'e11a023bc0ccf713cb50de9baa5140e59d3d4c52ec8952d9ca60326e040eda54',
            },
            'opbUwdiS1FBsrDUoPgZdx',
            'cuwakimacojulawu',
        );
        xApiKey = `${apiKey}:${apiEncryption}`;

        await app.init();
    });

    it(`POST ${E2E_AUTH_REFRESH_URL} Not Found`, async () => {
        const response = await request(app.getHttpServer())
            .post(E2E_AUTH_REFRESH_URL)
            .set('Authorization', `Bearer ${refreshTokenNotFound}`)
            .set('user-agent', faker.internet.userAgent())
            .set('x-timestamp', timestamp.toString())
            .set('x-api-key', xApiKey);

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        expect(response.body.statusCode).toEqual(
            UserStatusCodeError.UserNotFoundError,
        );

        return;
    });

    it(`POST ${E2E_AUTH_REFRESH_URL} Inactive`, async () => {
        await userService.inactive(user._id);
        const response = await request(app.getHttpServer())
            .post(E2E_AUTH_REFRESH_URL)
            .set('Authorization', `Bearer ${refreshToken}`)
            .set('user-agent', faker.internet.userAgent())
            .set('x-timestamp', timestamp.toString())
            .set('x-api-key', xApiKey);

        await userService.active(user._id);
        expect(response.status).toEqual(HttpStatus.FORBIDDEN);
        expect(response.body.statusCode).toEqual(
            UserStatusCodeError.UserIsInactiveError,
        );

        return;
    });

    it(`POST ${E2E_AUTH_REFRESH_URL} Role Inactive`, async () => {
        await roleService.inactive(`${user.role}`);
        const response = await request(app.getHttpServer())
            .post(E2E_AUTH_REFRESH_URL)
            .set('Authorization', `Bearer ${refreshToken}`)
            .set('user-agent', faker.internet.userAgent())
            .set('x-timestamp', timestamp.toString())
            .set('x-api-key', xApiKey);

        await roleService.active(`${user.role}`);
        expect(response.status).toEqual(HttpStatus.FORBIDDEN);
        expect(response.body.statusCode).toEqual(
            RoleStatusCodeError.RoleIsInactiveError,
        );

        return;
    });

    it(`POST ${E2E_AUTH_REFRESH_URL} Password Expired`, async () => {
        await userService.updatePasswordExpired(user._id, passwordExpired);
        const response = await request(app.getHttpServer())
            .post(E2E_AUTH_REFRESH_URL)
            .set('Authorization', `Bearer ${refreshToken}`)
            .set('user-agent', faker.internet.userAgent())
            .set('x-timestamp', timestamp.toString())
            .set('x-api-key', xApiKey);

        await userService.updatePasswordExpired(
            user._id,
            passwordExpiredForward,
        );
        expect(response.status).toEqual(HttpStatus.FORBIDDEN);
        expect(response.body.statusCode).toEqual(
            AuthStatusCodeError.AuthPasswordExpiredError,
        );

        return;
    });

    it(`POST ${E2E_AUTH_REFRESH_URL} Success`, async () => {
        const response = await request(app.getHttpServer())
            .post(E2E_AUTH_REFRESH_URL)
            .set('Authorization', `Bearer ${refreshToken}`)
            .set('user-agent', faker.internet.userAgent())
            .set('x-timestamp', timestamp.toString())
            .set('x-api-key', xApiKey);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.body.statusCode).toEqual(HttpStatus.OK);

        return;
    });

    afterAll(async () => {
        try {
            await userService.deleteOneById(user._id);
        } catch (e) {
            console.error(e);
        }

        connection.close();
        await app.close();
    });
});

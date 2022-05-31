import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { AuthApiService } from '@/auth/service/auth.api.service';
import { Request } from 'express';
import { AuthApiDocument } from '@/auth/schema/auth.api.schema';
import { IAuthApiRequestHashedData } from '@/auth/auth.interface';
import { AuthStatusCodeError } from '@/auth/auth.constant';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
    constructor(private readonly authApiService: AuthApiService) {
        super(
            { header: 'X-API-KEY', prefix: '' },
            true,
            async (
                apiKey: string,
                verified: (
                    error: Error,
                    user?: Record<string, any>,
                    info?: string | number,
                ) => Promise<void>,
                req: Request,
            ) => this.validate(apiKey, verified, req),
        );
    }

    async validate<TUser = any>(
        apiKey: string,
        verified: (
            error: Error,
            user?: TUser,
            info?: string | number,
        ) => Promise<void>,
        req: any,
    ) {
        const xApiKey: string[] = apiKey.split(':');
        const key = xApiKey[0];
        const encrypted = xApiKey[1];

        const authApi: AuthApiDocument = await this.authApiService.findOneByKey(
            key,
        );
        if (!authApi) {
            verified(
                null,
                null,
                `${AuthStatusCodeError.AuthGuardApiKeyNotFoundError}`,
            );
        } else if (!authApi.isActive) {
            verified(
                null,
                null,
                `${AuthStatusCodeError.AuthGuardApiKeyInactiveError}`,
            );
        }

        const decrypted: IAuthApiRequestHashedData =
            await this.authApiService.decryptApiKey(
                encrypted,
                authApi.encryptionKey,
                authApi.passphrase,
            );

        const keys: string[] = ['key', 'timestamp', 'hash'];
        const deKeys: string[] = Object.keys(decrypted);
        const hasKey: boolean = keys.every((key) => deKeys.includes(key));

        const timestamp: number = parseInt(
            req.headers['x-timestamp'] as string,
        );

        if (!hasKey) {
            verified(
                null,
                null,
                `${AuthStatusCodeError.AuthGuardApiKeySchemaInvalidError}`,
            );
        } else if (key !== decrypted.key) {
            verified(
                null,
                null,
                `${AuthStatusCodeError.AuthGuardApiKeyInvalidError}`,
            );
        } else if (timestamp !== decrypted.timestamp) {
            verified(
                new Error(
                    `${AuthStatusCodeError.AuthGuardApiKeyTimestampNotMatchWithRequestError}`,
                ),
            );
        }

        const validateApiKey: boolean =
            await this.authApiService.validateHashApiKey(
                decrypted.hash,
                authApi.hash,
            );
        if (!validateApiKey) {
            verified(
                null,
                null,
                `${AuthStatusCodeError.AuthGuardApiKeyInvalidError}`,
            );
        }

        req.apiKey = {
            _id: authApi._id,
            key: authApi.key,
            name: authApi.name,
            description: authApi.description,
        };
        verified(null, authApi as any);
    }
}

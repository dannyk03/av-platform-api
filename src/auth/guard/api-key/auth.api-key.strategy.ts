import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { AuthApiService } from '@/auth/service/auth.api.service';
import { Request } from 'express';
import { AuthApi } from '@/auth/entity/auth.api.entity';
import { IAuthApiRequestHashedData } from '@/auth/auth.interface';
import { EnumAuthStatusCodeError } from '@/auth/auth.constant';

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

    const authApi: AuthApi = await this.authApiService.findOneByKey(key);
    if (!authApi) {
      verified(
        null,
        null,
        `${EnumAuthStatusCodeError.AuthGuardApiKeyNotFoundError}`,
      );
    } else if (!authApi.isActive) {
      verified(
        null,
        null,
        `${EnumAuthStatusCodeError.AuthGuardApiKeyInactiveError}`,
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

    const timestamp: number = Number.parseInt(
      req.headers['x-timestamp'] as string,
    );

    if (!hasKey) {
      verified(
        null,
        null,
        `${EnumAuthStatusCodeError.AuthGuardApiKeySchemaInvalidError}`,
      );
    } else if (key !== decrypted.key) {
      verified(
        null,
        null,
        `${EnumAuthStatusCodeError.AuthGuardApiKeyInvalidError}`,
      );
    } else if (timestamp !== decrypted.timestamp) {
      verified(
        new Error(
          `${EnumAuthStatusCodeError.AuthGuardApiKeyTimestampNotMatchWithRequestError}`,
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
        `${EnumAuthStatusCodeError.AuthGuardApiKeyInvalidError}`,
      );
    }

    req.apiKey = {
      id: authApi.id,
      key: authApi.key,
      name: authApi.name,
      description: authApi.description,
    };
    verified(null, authApi as any);
  }
}

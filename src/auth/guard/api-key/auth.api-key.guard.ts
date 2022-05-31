import { AuthGuard } from '@nestjs/passport';
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { AuthStatusCodeError } from '@/auth/auth.constant';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard extends AuthGuard('api-key') {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector,
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const mode = this.configService.get<string>('app.mode');
        const excludeApiKey = this.reflector.get<boolean>(
            'excludeApiKey',
            context.getHandler(),
        );

        const request = context.switchToHttp().getRequest();
        request.apiKey = {};

        if (excludeApiKey || mode !== 'secure') {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest<TUser = any>(
        err: Record<string, any>,
        user: TUser,
        info: Error | string,
    ): TUser {
        if (err || !user) {
            this.debuggerService.error(
                info instanceof Error ? info.message : `${info}`,
                'ApiKeyGuard',
                'handleRequest',
                err,
            );

            if (
                info instanceof Error &&
                info.name === 'BadRequestError' &&
                info.message === 'Missing API Key'
            ) {
                throw new UnauthorizedException({
                    statusCode: AuthStatusCodeError.AuthGuardApiKeyNeededError,
                    message: 'auth.apiKey.error.keyNeeded',
                });
            } else if (
                info instanceof Error &&
                info.name === 'BadRequestError' &&
                info.message.startsWith('Invalid API Key prefix')
            ) {
                throw new UnauthorizedException({
                    statusCode:
                        AuthStatusCodeError.AuthGuardApiKeyPrefixInvalidError,
                    message: 'auth.apiKey.error.prefixInvalid',
                });
            }

            const statusCode: number = parseInt(info as string);

            if (
                statusCode ===
                AuthStatusCodeError.AuthGuardApiKeySchemaInvalidError
            ) {
                throw new UnauthorizedException({
                    statusCode:
                        AuthStatusCodeError.AuthGuardApiKeySchemaInvalidError,
                    message: 'auth.apiKey.error.schemaInvalid',
                });
            } else if (
                statusCode ===
                AuthStatusCodeError.AuthGuardApiKeyTimestampNotMatchWithRequestError
            ) {
                throw new UnauthorizedException({
                    statusCode:
                        AuthStatusCodeError.AuthGuardApiKeyTimestampNotMatchWithRequestError,
                    message: 'auth.apiKey.error.timestampNotMatchWithRequest',
                });
            } else if (
                statusCode === AuthStatusCodeError.AuthGuardApiKeyNotFoundError
            ) {
                throw new UnauthorizedException({
                    statusCode:
                        AuthStatusCodeError.AuthGuardApiKeyNotFoundError,
                    message: 'auth.apiKey.error.notFound',
                });
            } else if (
                statusCode === AuthStatusCodeError.AuthGuardApiKeyInactiveError
            ) {
                throw new UnauthorizedException({
                    statusCode:
                        AuthStatusCodeError.AuthGuardApiKeyInactiveError,
                    message: 'auth.apiKey.error.inactive',
                });
            }

            throw new UnauthorizedException({
                statusCode: AuthStatusCodeError.AuthGuardApiKeyInvalidError,
                message: 'auth.apiKey.error.invalid',
            });
        }

        return user;
    }
}

import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { DebuggerService } from '@/debugger';
import { EnumAuthStatusCodeError } from '@/auth';

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
          statusCode: EnumAuthStatusCodeError.AuthGuardApiKeyNeededError,
          message: 'auth.apiKey.error.keyNeeded',
        });
      } else if (
        info instanceof Error &&
        info.name === 'BadRequestError' &&
        info.message.startsWith('Invalid API Key prefix')
      ) {
        throw new UnauthorizedException({
          statusCode: EnumAuthStatusCodeError.AuthGuardApiKeyPrefixInvalidError,
          message: 'auth.apiKey.error.prefixInvalid',
        });
      }

      const statusCode: number = Number.parseInt(info as string);

      if (
        statusCode === EnumAuthStatusCodeError.AuthGuardApiKeySchemaInvalidError
      ) {
        throw new UnauthorizedException({
          statusCode: EnumAuthStatusCodeError.AuthGuardApiKeySchemaInvalidError,
          message: 'auth.apiKey.error.schemaInvalid',
        });
      } else if (
        statusCode ===
        EnumAuthStatusCodeError.AuthGuardApiKeyTimestampNotMatchWithRequestError
      ) {
        throw new UnauthorizedException({
          statusCode:
            EnumAuthStatusCodeError.AuthGuardApiKeyTimestampNotMatchWithRequestError,
          message: 'auth.apiKey.error.timestampNotMatchWithRequest',
        });
      } else if (
        statusCode === EnumAuthStatusCodeError.AuthGuardApiKeyNotFoundError
      ) {
        throw new UnauthorizedException({
          statusCode: EnumAuthStatusCodeError.AuthGuardApiKeyNotFoundError,
          message: 'auth.apiKey.error.notFound',
        });
      } else if (
        statusCode === EnumAuthStatusCodeError.AuthGuardApiKeyInactiveError
      ) {
        throw new UnauthorizedException({
          statusCode: EnumAuthStatusCodeError.AuthGuardApiKeyInactiveError,
          message: 'auth.apiKey.error.inactive',
        });
      }

      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardApiKeyInvalidError,
        message: 'auth.apiKey.error.invalid',
      });
    }

    return user;
  }
}

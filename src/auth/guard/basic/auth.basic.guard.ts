import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnumAuthStatusCodeError } from '@/auth';
import { DebuggerService } from '@/debugger';
import { AuthApiService } from '@/auth';

@Injectable()
export class BasicGuard implements CanActivate {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly authApiService: AuthApiService,
  ) {
    this.clientId = this.configService.get<string>('auth.basicToken.clientId');
    this.clientSecret = this.configService.get<string>(
      'auth.basicToken.clientSecret',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization: string = request.headers.authorization;

    if (!authorization) {
      this.debuggerService.error(
        'AuthBasicGuardError',
        'BasicGuard',
        'canActivate',
      );

      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardBasicTokenNeededError,
        message: 'http.clientError.unauthorized',
      });
    }

    const clientBasicToken: string = authorization.replace('Basic ', '');
    const ourBasicToken: string = await this.authApiService.createBasicToken(
      this.clientId,
      this.clientSecret,
    );

    const validateBasicToken: boolean =
      await this.authApiService.validateBasicToken(
        clientBasicToken,
        ourBasicToken,
      );

    if (!validateBasicToken) {
      this.debuggerService.error(
        'AuthBasicGuardError Validate Basic Token',
        'BasicGuard',
        'canActivate',
      );

      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardBasicTokenInvalidError,
        message: 'http.clientError.unauthorized',
      });
    }

    return true;
  }
}

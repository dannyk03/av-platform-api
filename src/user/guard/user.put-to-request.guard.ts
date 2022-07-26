import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// Services
import { UserService } from '../service';
//
import { EnumAuthStatusCodeError } from '$/auth';
import { Reflector } from '@nestjs/core';
import {
  USER_LOAD_AUTH_SENSITIVE_DATA,
  USER_RELATIONS_META_KEY,
} from '../user.constant';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;
    const loadAuthSensitiveData = this.reflector.getAllAndOverride<boolean>(
      USER_LOAD_AUTH_SENSITIVE_DATA,
      [ctx.getHandler(), ctx.getClass()],
    );
    const loadRelations = this.reflector.getAllAndOverride<string[]>(
      USER_RELATIONS_META_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    const defaultRelations = [
      'organization',
      'role',
      'role.policy',
      'role.policy.subjects',
      'role.policy.subjects.abilities',
    ];

    const relations = [
      'authConfig',
      ...(loadRelations?.length ? loadRelations : defaultRelations),
    ];

    const requestUser = await this.userService.findOne({
      where: {
        email: user.email,
      },
      relations,
      select: {
        organization: {
          isActive: true,
          id: true,
          name: true,
          slug: true,
        },
        authConfig: {
          password: loadAuthSensitiveData,
          passwordExpiredAt: true,
          emailVerifiedAt: true,
        },
      },
    });

    if (!requestUser) {
      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtAccessTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    request.__user = requestUser;

    return true;
  }
}

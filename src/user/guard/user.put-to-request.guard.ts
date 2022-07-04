import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// Services
import { UserService } from '../service/user.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import { EnumAuthStatusCodeError } from '@/auth';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;

    const requestUser = await this.userService.findOneById(user.id, {
      relations: [
        'organization',
        'authConfig',
        'role',
        'role.policy',
        'role.policy.subjects',
        'role.policy.subjects.abilities',
      ],
      select: {
        organization: {
          isActive: true,
          id: true,
          name: true,
          slug: true,
        },
        authConfig: {
          password: true,
          passwordExpiredAt: true,
        },
      },
    });

    if (!requestUser) {
      this.debuggerService.error(
        'User not found',
        'UserPutToRequestGuard',
        'canActivate',
      );

      throw new UnauthorizedException({
        statusCode: EnumAuthStatusCodeError.AuthGuardJwtAccessTokenError,
        message: 'http.clientError.unauthorized',
      });
    }

    request.__user = requestUser;

    return true;
  }
}
